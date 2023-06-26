import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import {Button, Image} from 'UnityEngine.UI'
import { TMP_Text } from 'TMPro';
import Manager, { InterManager } from '../../Manager/Manager';
import IOC from '../../IOC';
import { InterMyPlayerController, MyPlayerController } from '../../MyPlayer/MyPalyerController';

export default class GameSelectPopupUI extends ZepetoScriptBehaviour {
    public flagBtn: Button;
    public siegeBtn: Button;
    public soloFlagBtn: Button;
    public Btn1: Button;
    public Btn2: Button;
    public Btn3: Button;
    
    private manager: InterManager;
    private myPlayerController: InterMyPlayerController;
    

    Start() {
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.flagBtn.onClick.AddListener(()=>{
            this.manager.FlagGame.GameStart(this.myPlayerController.MyPlayerData.MySessionId);
            this.manager.UI.DeletePopUpUI()
        });
        this.siegeBtn.onClick.AddListener(()=>{
            this.manager.SiegeGame.GameStart(this.myPlayerController.MyPlayerData.MySessionId);
            this.manager.UI.DeletePopUpUI()
        });
        this.soloFlagBtn.onClick.AddListener(()=>{
            // this.manager.SoloFlagGame.GameStart(this.myPlayerController.MyPlayerData.MySessionId);
            // this.manager.UI.DeletePopUpUI()
        });
        this.Btn1.onClick.AddListener(()=>{
            
        });
        this.Btn2.onClick.AddListener(()=>{

        });
        this.Btn3.onClick.AddListener(()=>{

        });
    }

}