import { GAME_NAME } from "../Enums";
import IOC from "../IOC";
import Manager, { InterManager } from "./Manager";
import {BoxCollider, GameObject, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import {InterMyPlayerController, MyPlayerController } from "../MyPlayer/MyPalyerController";
import Utils from "../Utils/index"


export interface InterSiegeGameManager {
    Init(): void;
    
    GameStart(sessionId: string): void;
    
    JoinGame(team: string): void;

    LeaveGame(): void;

    EndGame(winningTeam: string): void;

    RuntheGame(): void;

    Respawn(team: string)

    Siege(team: string)
    
    get SiegeTeam()
}

export default class SiegeGameManager implements InterSiegeGameManager{
    manager: InterManager;
    myPlayerController: InterMyPlayerController;
    private SiegeStartPoint: Transform;
    private SiegeEnv: GameObject;
    private siegeteam: string = "";

    Init(){
        this.manager = IOC.Instance.getInstance<InterManager>(Manager);
        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
        this.SiegeEnv = GameObject.Find("SiegeGameZone")
        this.SiegeEnv.SetActive(false);
    }

    GameStart(sessionId: string){
        this.manager.Game.NowOnGame = GAME_NAME.Siege;
        this.manager.Game.GameStart(sessionId)
    }

    RuntheGame(){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        if(!this.SiegeStartPoint) this.SiegeStartPoint = GameObject.Find("SiegeStartPoint").transform;
        if(!this.SiegeEnv) this.SiegeEnv = GameObject.Find("SiegeGameZone");
        if(!this.SiegeEnv.activeSelf){
            this.SiegeEnv.SetActive(true)
        }
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.SiegeStartPoint) this.SiegeStartPoint = GameObject.Find("SiegeStartPoint").transform;
        let rangeCollider = this.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

        let respawnPosition = Utils.VectorPlusCalc(this.SiegeStartPoint.GetChild(0).GetChild(0).transform.position, new Vector3(range_X, 0, range_Z));
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam('A')
        this.manager.Game.IsGamePlaying = true;
    }

    JoinGame(team: string){
        this.manager.UI.CloseDefaultUI('StartUI');
        this.manager.UI.ShowDefaultUI('InGameUI');
        this.manager.UI.ControllerUI.SetJump(true);
        this.manager.UI.ControllerUI.SetPad(true);
        if(!this.SiegeEnv) this.SiegeEnv = GameObject.Find("SiegeGameZone");
        if(!this.SiegeEnv.activeSelf){
            this.SiegeEnv.SetActive(true)
        }
        if(!this.SiegeStartPoint) this.SiegeStartPoint = GameObject.Find("SiegeStartPoint").transform;
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3
        if(team === "A") {
            rangeCollider = this.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.SiegeStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.SiegeStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.SiegeStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        this.myPlayerController.MyPlayerData.SetTeam(team)
        this.manager.Game.IsGamePlaying = true;
    }

    LeaveGame(){
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint.position, this.manager.Game.HomePoint.rotation);
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ShowDefaultUI('StartUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
    }

    EndGame(winningTeam: string){
        this.manager.UI.CloseDefaultUI('InGameUI')
        this.manager.UI.ControllerUI.SetJump(false);
        this.manager.UI.ControllerUI.SetPad(false);
        if(!this.SiegeEnv) this.SiegeEnv = GameObject.Find("SiegeGameZone");
        if(this.SiegeEnv.activeSelf){
            this.SiegeEnv.SetActive(false)
        }
        if(winningTeam === this.myPlayerController.MyPlayerData.Team){
            //보상
        }
        this.myPlayerController.MyPlayerData.SetTeam("")
        this.manager.Game.IsGamePlaying = false;
        if(!this.manager.Game.HomePoint) this.manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
        this.myPlayerController.MyPlayerMovement.Teleport(this.manager.Game.HomePoint.position, this.manager.Game.HomePoint.rotation);
    }

    Respawn(team: string){
        if(!this.SiegeEnv) this.SiegeEnv = GameObject.Find("SiegeGameZone");
        if(!this.SiegeEnv.activeSelf){
            this.SiegeEnv.SetActive(true)
        }
        if(!this.SiegeStartPoint) this.SiegeStartPoint = GameObject.Find("SiegeStartPoint").transform;
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3
        if(team === "A") {
            rangeCollider = this.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.SiegeStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = this.SiegeStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(this.SiegeStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        this.myPlayerController.MyPlayerMovement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }
    
    Siege(team: string){
        if(team === "A"){
            this.manager.UI.InGameUI.BteamSiege.SetActive(false)
            this.manager.UI.InGameUI.AteamSiege.SetActive(true)
        }
        else{
            this.manager.UI.InGameUI.AteamSiege.SetActive(false)
            this.manager.UI.InGameUI.BteamSiege.SetActive(true)
        }
        
        if(team === this.myPlayerController.MyPlayerData.Team){
            //우리팀이 점령 성공했다 UI
            this.manager.UI.ShowPopUpUI("MyTeamSiege")
        }
        else{
            //적이 점령 성공했다 UI
            this.manager.UI.ShowPopUpUI("OpponentSiege")
        }
        this.siegeteam = team
    }

    get SiegeTeam(){
        return this.siegeteam
    }
}
