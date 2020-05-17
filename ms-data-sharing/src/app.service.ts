import { Injectable, Logger } from '@nestjs/common';
import { ShareMessage } from './shareMessage.interface';
import * as dotenv from 'dotenv';


const Web3 = require("web3");
const EEAClient = require("web3-eea");
const { orion, besu } = require("../config/keys.js");

dotenv.config();

//Initialize EEA client
const web3 = new EEAClient(new Web3("http://besu-sample-networks_node1_1:8545"), 2018);

// const node1 = new EEAClient(new Web3(besu.node1.url), 2018);
// const node2 = new EEAClient(new Web3(besu.node2.url), 2018);

// const node1 = new EEAClient(new Web3("http://node1:8545"), 2018);
// const node2 = new EEAClient(new Web3("http://node2:8545"), 2018);

@Injectable()
export class AppService {

  private logger = new Logger('AppService');

  async share(message: ShareMessage): Promise<any> {
    this.logger.log("sharing item with recipient...")

    //Create onchain privacy group between 1 and 2
    //To do => create on the basis on the recipientId. Do not create if privacy group already exist
    //To do => move this outside of App service (see example)
    
    const createPrivacyGroup = () => {
      const contractOptions = {
        addresses: [orion.node1.publicKey, orion.node2.publicKey],
        name: "Privacy Group A",
        description: "Members of Group A"
      };
    web3.eea.createPrivacyGroup(contractOptions).then(result => {
      this.logger.log(`The privacy group created is:`, result);
      return result;
      });
    };


  }
}








  

