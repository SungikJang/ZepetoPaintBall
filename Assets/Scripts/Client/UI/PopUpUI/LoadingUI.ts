import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Slider} from "UnityEngine.UI";

export default class LoadingUI extends ZepetoScriptBehaviour {

    public loadSlider: Slider;

    Start() {
        this.loadSlider.value = 0;
    }
}