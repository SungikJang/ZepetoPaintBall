import { GAME_NAME } from "../Enums";
import Manager from "./Manager";
import {BoxCollider, GameObject, Quaternion, Random, Transform, Vector3} from "UnityEngine";
import Utils from "../Utils/index"
import MyPlayerController from "../MyPlayerController/MyPlayerController";

export default class SiegeGameManager{
    private siegeteam: string = "";

    Init(){
        
    }

    GameStart(sessionId: string){
        Manager.Game.NowOnGame = GAME_NAME.Siege;
        Manager.Game.GameStart(sessionId)
    }

    RuntheGame(){
        Manager.UI.CloseDefaultUI('StartUI');
        Manager.UI.ShowDefaultUI('InGameUI');
        if(!Manager.Game.ObjectController.SiegeEnv.activeSelf){
            Manager.Game.ObjectController.SiegeEnv.SetActive(true)
        }
        Manager.UI.ControllerUI.SetJump(true);
        Manager.UI.ControllerUI.SetPad(true);
        let rangeCollider = Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
        let range_X = rangeCollider.bounds.size.x;
        let range_Z = rangeCollider.bounds.size.z;

        range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
        range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

        let respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).transform.position, new Vector3(range_X, 0, range_Z));
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
        MyPlayerController.Data.SetTeam('A')
        Manager.Game.IsGamePlaying = true;
    }

    JoinGame(team: string){
        Manager.UI.CloseDefaultUI('StartUI');
        Manager.UI.ShowDefaultUI('InGameUI');
        Manager.UI.ControllerUI.SetJump(true);
        Manager.UI.ControllerUI.SetPad(true);
        if(!Manager.Game.ObjectController.SiegeEnv.activeSelf){
            Manager.Game.ObjectController.SiegeEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3
        if(team === "A") {
            rangeCollider = Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = Manager.Game.ObjectController.SiegeStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.SiegeStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
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
        if(Manager.Game.ObjectController.SiegeEnv.activeSelf){
            Manager.Game.ObjectController.SiegeEnv.SetActive(false)
        }
        if(winningTeam === MyPlayerController.Data.Team){
            //보상
        }
        MyPlayerController.Data.SetTeam("")
        Manager.Game.IsGamePlaying = false;
        MyPlayerController.Movement.Teleport(Manager.Game.ObjectController.homePoint.position, Manager.Game.ObjectController.homePoint.rotation);
    }

    Respawn(team: string){
        if(!Manager.Game.ObjectController.SiegeEnv.activeSelf){
            Manager.Game.ObjectController.SiegeEnv.SetActive(true)
        }
        let rangeCollider: BoxCollider;
        let respawnPosition: Vector3
        if(team === "A") {
            rangeCollider = Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.SiegeStartPoint.GetChild(0).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        else{
            rangeCollider = Manager.Game.ObjectController.SiegeStartPoint.GetChild(1).GetChild(0).GetComponent<BoxCollider>();
            let range_X = rangeCollider.bounds.size.x;
            let range_Z = rangeCollider.bounds.size.z;

            range_X = Random.Range( (range_X / 2) * -1, range_X / 2);
            range_Z = Random.Range( (range_Z / 2) * -1, range_Z / 2);

            respawnPosition = Utils.VectorPlusCalc(Manager.Game.ObjectController.SiegeStartPoint.GetChild(1).GetChild(0).position, new Vector3(range_X, 0, range_Z));
        }
        MyPlayerController.Movement.Teleport(respawnPosition, Quaternion.Euler(Vector3.zero))
    }
    
    Siege(team: string){
        if(team === "A"){
            Manager.UI.InGameUI.BteamSiege.SetActive(false)
            Manager.UI.InGameUI.AteamSiege.SetActive(true)
        }
        else{
            Manager.UI.InGameUI.AteamSiege.SetActive(false)
            Manager.UI.InGameUI.BteamSiege.SetActive(true)
        }
        
        if(team === MyPlayerController.Data.Team){
            //우리팀이 점령 성공했다 UI
            Manager.UI.ShowPopUpUI("MyTeamSiege")
        }
        else{
            //적이 점령 성공했다 UI
            Manager.UI.ShowPopUpUI("OpponentSiege")
        }
        this.siegeteam = team
    }

    get SiegeTeam(){
        return this.siegeteam
    }
}
