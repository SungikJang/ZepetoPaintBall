import { GAME_NAME } from "../Enums";
import Manager from "./Manager";
import {BoxCollider, GameObject, LayerMask, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import Utils from "../Utils/index"
import Connector from "../Network/Connector";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import OtherZepetoCharacterController from "../Controller/OtherZepetoCharacterController";
import MyPlayerController from "../MyPlayerController/MyPlayerController";

export default class FlagGameManager{
    private winningTeam: string = "";

    Init(){
    }

    GameStart(sessionId: string){
        Manager.Game.NowOnGame = GAME_NAME.Flag;
        Manager.Game.GameStart(sessionId)
    }
    
    RuntheGame(){
        Manager.UI.CloseDefaultUI('StartUI');
        Manager.UI.ShowDefaultUI('InGameUI');
        Manager.UI.ControllerUI.SetJump(true);
        Manager.UI.ControllerUI.SetPad(true);
        if(!Manager.Game.ObjectController.FlagEnv.activeSelf){
            Manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        if(!Manager.Game.ObjectController.flagObj.activeSelf){
            Manager.Game.ObjectController.flagObj.SetActive(true);
        }
        let rangeCollider = Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);
        
        let respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        MyPlayerController.Data.SetTeam('A')
        Manager.Game.IsGamePlaying = true;
    }

    JoinGame(team: string){
        Manager.UI.CloseDefaultUI('StartUI');
        Manager.UI.ShowDefaultUI('InGameUI');
        Manager.UI.ControllerUI.SetJump(true);
        Manager.UI.ControllerUI.SetPad(true);
        if(!Manager.Game.ObjectController.FlagEnv.activeSelf){
            Manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = Manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        MyPlayerController.Data.SetTeam(team)
        Manager.Game.IsGamePlaying = true;
    }

    LeaveGame(){
        MyPlayerController.Data.SetTeam("")
        Manager.Game.IsGamePlaying = false;
        MyPlayerController.Movement.Teleport(Manager.Game.ObjectController.homePoint.position, Manager.Game.ObjectController.homePoint.rotation);
        Manager.UI.CloseDefaultUI('InGameUI')
        Manager.UI.ShowDefaultUI('StartUI')
        Manager.UI.ControllerUI.SetJump(false);
        Manager.UI.ControllerUI.SetPad(false);
    }

    EndGame(winningTeam: string){
        Manager.UI.CloseDefaultUI('InGameUI')
        Manager.UI.ControllerUI.SetJump(false);
        Manager.UI.ControllerUI.SetPad(false);
        if(Manager.Game.ObjectController.flagObj.activeSelf){
            Manager.Game.ObjectController.flagObj.SetActive(false)
        }
        if(Manager.Game.ObjectController.FlagEnv.activeSelf){
            Manager.Game.ObjectController.FlagEnv.SetActive(false)
        }
        if(winningTeam === MyPlayerController.Data.Team){
            //보상
        }
        MyPlayerController.Data.SetTeam("")
        Manager.Game.IsGamePlaying = false;
        MyPlayerController.Movement.Teleport(Manager.Game.ObjectController.homePoint.position, Manager.Game.ObjectController.homePoint.rotation);
    }

    Respawn(team: string){
        if(!Manager.Game.ObjectController.FlagEnv.activeSelf){
            Manager.Game.ObjectController.FlagEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3;
        if(team === "A") {
            rangeCollider = Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.FlagStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = Manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.FlagStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }
    
    GetFlag(team: string, player: string){
        this.winningTeam = team;
        if(!Manager.Game.ObjectController.flagObj) Manager.Game.ObjectController.flagObj = Manager.Game.ObjectController.flagObj;
        if(player === MyPlayerController.Data.MySessionId){
            //돈줘야댐
            MyPlayerController.Movement.TakeFlag(Manager.Game.ObjectController.flagObj);
        }
        else{
            ZepetoPlayers.instance.GetPlayer(player).character.gameObject.GetComponent<OtherZepetoCharacterController>().TakeFlag(Manager.Game.ObjectController.flagObj)
        }
    }

    get WinnigTeam(){
        return this.winningTeam
    }

    FreeFlag(){
        let p = Manager.Game.ObjectController.flagObj.transform.position
        Manager.Game.ObjectController.flagObj.transform.position = new Vector3(p.x, p.y - 2, p.z)
        Manager.Game.ObjectController.flagObj.transform.SetParent(Manager.Game.ObjectController.Colliders);
        Connector.Instance.ReqToServer("FreeFlag")
    }
}