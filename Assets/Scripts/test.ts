import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Manager from './Client/Manager/Manager';

export default class test extends ZepetoScriptBehaviour {
    
    public pbtn: Button;
    public mbtn: Button;

    Start() {
        this.pbtn.onClick.AddListener(() => {
            Manager.Product.GainBalance('zepetogunsgold', 100);
        })
        this.mbtn.onClick.AddListener(() => {
            Manager.Product.UseBalance('zepetogunsgold', 100);
        })
    }

}