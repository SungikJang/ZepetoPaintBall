import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import IOC from './Client/IOC';
import Manager, { InterManager } from './Client/Manager/Manager';

export default class test extends ZepetoScriptBehaviour {
    
    public pbtn: Button;
    public mbtn: Button;

    Start() {
        this.pbtn.onClick.AddListener(() => {
            IOC.Instance.getInstance<InterManager>(Manager).Product.GainBalance('zepetogunsgold', 100);
        })
        this.mbtn.onClick.AddListener(() => {
            IOC.Instance.getInstance<InterManager>(Manager).Product.UseBalance('zepetogunsgold', 100);
        })
    }

}