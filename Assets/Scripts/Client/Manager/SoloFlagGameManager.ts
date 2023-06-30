import {BoxCollider, GameObject, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import { GAME_NAME } from "../Enums";
import Manager from "./Manager";
import Utils from "../Utils/index"
import Connector from "../Network/Connector";

export interface InterSoloFlagGameManager {
    Init(): void;
    //
    // GameStart(sessionId: string): void;
    //
    // JoinGame(): void;
    //
    // LeaveGame(): void;
    //
    // EndGame(winningTeam: string): void;
    //
    // RuntheGame(sessionId: string): void;
    //
    // Respawn()
    //
    // GetFlag()
}

export default class SoloFlagGameManager implements InterSoloFlagGameManager{
    private SoloFlagStartPoint: Transform;
    
    private SoloFlagEnv: GameObject;

    Init(){
        // 
        // 
        // this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone")
        // this.SoloFlagEnv.SetActive(false);
    }
    //
    // GameStart(sessionId: string){
    //     Manager.Game.NowOnGame = GAME_NAME.SoloFlag;
    //     Manager.Game.GameStart(sessionId);
    // }
    //
    // RuntheGame(sessionId: string){
    //     Manager.UI.CloseDefaultUI('StartUI');
    //     Manager.UI.ShowDefaultUI('InGameUI');
    //     Manager.UI.ControllerUI.SetJump(true);
    //     Manager.UI.ControllerUI.SetPad(true);
    //     if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
    //     if(!this.SoloFlagEnv.activeSelf){
    //         this.SoloFlagEnv.SetActive(true)
    //     }
    //     if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
    //     const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
    //     let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
    //     let range_X = rangeCollider.bounds.size.x;
    //     let range_Z = rangeCollider.bounds.size.z;
    //
    //     range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
    //     range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
    //
    //     let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
    //     MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    //     MyPlayerController.Data.SetTeam(MyPlayerController.Data.MySessionId)
    //     Manager.Game.IsGamePlaying = true;
    // }
    //
    // JoinGame(){
    //     Manager.UI.CloseDefaultUI('StartUI');
    //     Manager.UI.ShowDefaultUI('InGameUI');
    //     Manager.UI.ControllerUI.SetJump(true);
    //     Manager.UI.ControllerUI.SetPad(true);
    //     if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
    //     if(!this.SoloFlagEnv.activeSelf){
    //         this.SoloFlagEnv.SetActive(true)
    //     }
    //     if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
    //     const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
    //     let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
    //     let range_X = rangeCollider.bounds.size.x;
    //     let range_Z = rangeCollider.bounds.size.z;
    //
    //     range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
    //     range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
    //
    //     let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
    //     MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    //     MyPlayerController.Data.SetTeam(MyPlayerController.Data.MySessionId);
    //     Manager.Game.IsGamePlaying = true;
    // }
    //
    // LeaveGame(){
    //     MyPlayerController.Data.SetTeam("")
    //     Manager.Game.IsGamePlaying = false;
    //     if(!Manager.Game.HomePoint) Manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
    //     MyPlayerController.Movement.Teleport(Manager.Game.HomePoint.position, Manager.Game.HomePoint.rotation);
    //     Manager.UI.CloseDefaultUI('InGameUI')
    //     Manager.UI.ShowDefaultUI('StartUI')
    //     Manager.UI.ControllerUI.SetJump(false);
    //     Manager.UI.ControllerUI.SetPad(false);
    // }
    //
    // EndGame(winningTeam: string){
    //     Manager.UI.CloseDefaultUI('InGameUI')
    //     Manager.UI.ControllerUI.SetJump(false);
    //     Manager.UI.ControllerUI.SetPad(false);
    //     if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
    //     if(this.SoloFlagEnv.activeSelf){
    //         this.SoloFlagEnv.SetActive(false)
    //     }
    //     if(winningTeam === MyPlayerController.Data.Team){
    //         //보상
    //     }
    //     MyPlayerController.Data.SetTeam("")
    //     Manager.Game.IsGamePlaying = false;
    //     if(!Manager.Game.HomePoint) Manager.Game.HomePoint = GameObject.Find("HomePoint").transform;
    //     MyPlayerController.Movement.Teleport(Manager.Game.HomePoint.position, Manager.Game.HomePoint.rotation);
    // }
    //
    // Respawn(){
    //     if(!this.SoloFlagEnv) this.SoloFlagEnv = GameObject.Find("SoloFlagGameZone");
    //     if(!this.SoloFlagEnv.activeSelf){
    //         this.SoloFlagEnv.SetActive(true)
    //     }
    //     if(!this.SoloFlagStartPoint) this.SoloFlagStartPoint = GameObject.Find("SoloFlagStartPoint").transform;
    //     const ind = Utils.RandomInt(0, this.SoloFlagStartPoint.childCount);
    //     let rangeCollider = this.SoloFlagStartPoint.GetChild(ind).GetComponent<BoxCollider>();
    //     let range_X = rangeCollider.bounds.size.x;
    //     let range_Z = rangeCollider.bounds.size.z;
    //
    //     range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
    //     range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
    //
    //     let respawnPosition = Utils.VectorPlusCalc(this.SoloFlagStartPoint.GetChild(ind).position, new Vector3(range_X, 0, range_Z));
    //     MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    // }
    //
    // GetFlag(){
    //     Connector.Instance.ReqToServer("GetSoloFlag", {player: MyPlayerController.Data.MySessionId})
    // }
}
