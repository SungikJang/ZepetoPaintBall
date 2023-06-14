import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {TMP_Text} from 'TMPro';
import {GameObject, WaitForSeconds} from 'UnityEngine';
import { InterMyPlayerController, MyPlayerController } from '../../MyPlayer/MyPalyerController';
import Manager, { InterManager } from '../../Manager/Manager';
import IOC from '../../IOC';
import { GAME_NAME } from "../../Enums";
import ControllerUI from '../ControllerUI/ControllerUI';

export default class InGameUI extends ZepetoScriptBehaviour {
    
    public homeBtn: Button;
    public settingBtn: Button;
    public myTeamScore: TMP_Text;
    public opponentScore: TMP_Text;
    public myTeamFlag: GameObject;
    public opponentFlag: GameObject;
    public myTeamSeige: GameObject;
    public opponentSeige: GameObject;
    public ScoreObj1: GameObject;
    public ScoreObj2: GameObject;
    public minText: TMP_Text;
    public secText: TMP_Text;
    public leaveAlertObj: GameObject;

    public myPlayerController: InterMyPlayerController;
    public manager: InterManager;
    
    private instanceSet: boolean = false;

    Start() {
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.StartCoroutine(this.GetInstance());
        this.homeBtn.onClick.AddListener(()=>{
            this.manager.Game.LeaveGame();
        });
    }
    
    OnEnable(){
        if(!this.manager) this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        switch(this.manager.Game.NowOnGame){
            case GAME_NAME.Flag:
                this.ScoreObj1.SetActive(true);
                this.ScoreObj2.SetActive(true);
                break;
            case GAME_NAME.Siege:
                this.ScoreObj1.SetActive(true);
                this.ScoreObj2.SetActive(true);
                break;
            case GAME_NAME.SoloFlag:

                break;
        }
    }
    
    OnDisAble(){
        this.ScoreObj1.SetActive(false);
        this.ScoreObj2.SetActive(false);
    }
    
    Update(){
        this.UpdateTime();
    }
    
    UpdateTime(){
        let min: number = 0;
        let sec: number = 0;
        min = Math.floor(this.manager.Game.GameTime / 60)
        sec = Math.floor(this.manager.Game.GameTime % 60);
        if(min < 10){
            this.minText.text = '0' + min.toString()
        }
        else{
            this.minText.text = min.toString()
        }
        if(sec < 10){
            this.secText.text = '0' + sec.toString()
        }
        else{
            this.secText.text = sec.toString()
        }
    }

    * GetInstance(){
        while(!this.instanceSet){
            this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
            this.manager = IOC.Instance.getInstance<InterManager>(Manager);
            if(this.manager && this.myPlayerController){
                this.instanceSet = true;
                return;
            }
            yield new WaitForSeconds(0.1);
        }
    }
}