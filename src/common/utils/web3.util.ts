import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

export enum ConnectionMode {
  HTTP = 'http',
  WSS = 'wss',
}

@Injectable()
export class Web3Util {
  private web3: any;
  private subscription: any;
  private readonly connectionMode: ConnectionMode;

  constructor(
    private readonly configService: ConfigService,
    mode: ConnectionMode,
  ) {
    const infuraProjectId = configService.get('settings.infura.projectId');
    let provider: any;
    switch (mode) {
      case ConnectionMode.HTTP:
        provider = new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/v3/${infuraProjectId}`,
        );
        break;
      case ConnectionMode.WSS:
        provider = new Web3.providers.WebsocketProvider(
          `wss://mainnet.infura.io/ws/v3/${infuraProjectId}`,
        );
        break;
      default:
        throw new Error('Invalid connection mode');
    }

    this.web3 = new Web3(provider);
    this.connectionMode = mode;
  }

  async subscribeBlockHeaders(sendMessage: (data: any) => void): Promise<any> {
    this.checkMode(ConnectionMode.WSS, 'subscribeBlockHeaders');

    return new Promise((resolve, reject) => {
      this.subscription = this.web3.eth
        .subscribe('newBlockHeaders', function (error, result) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          console.log(result);
        })
        .on('connected', subscriptionId => {
          console.log('connected', subscriptionId);
          sendMessage('NewBlockHeaders connected with id: ' + subscriptionId);
          resolve('subscribed and connected');
        })
        .on('data', blockHeader => {
          console.log('data', blockHeader);
          sendMessage({
            message: 'Data from NewBlockHeaders',
            data: blockHeader,
          });
        })
        .on('error', error => {
          console.error('error', error);
          reject(error);
        });
    });
  }

  cleanSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe((error, success) => {
        if (success) {
          this.subscription = null;
          console.log('Successfully unsubscribed!');
        }
      });
    }
  }

  checkMode(mode: ConnectionMode, method: string) {
    if (this.connectionMode !== mode) {
      throw new Error(`Web3Util.${method}() is only available for ${mode}`);
    }
  }
}
