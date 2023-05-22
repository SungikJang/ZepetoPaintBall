import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { Player } from "ZEPETO.Multiplay.Schema";

export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        // Room이 생성될때 1회 호출된다 => Room초기화 로직 작성 가능
        
    }

    onJoin(client: SandboxPlayer) {
        //Client가 Room에 입장할 때 호출된다.

        console.log(`[OnJoin] sessionId: ${client.sessionId}, HashCode: ${client.hashCode}, userId: ${client.userId}`)
        
        const player = new Player();
        player.sessionId = client.sessionId
        if(client.hashCode) player.hashCode = client.hashCode
        if(client.userId) player.userId = client.userId
        
        this.state.players.set(client.sessionId, player);
        
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        //Client가 Room에서 퇴장할 때 호출된다.
        
    }
}

// Room EventListener 목록
// RoomCreated(Room)            Room이 생성되고, 접속 가능할 때 호출된다.
// RoomJoined(Room)             해당 Room에 접속되면 호출된다.
// RoomLeave(RoomLeaveEvent)    해당 Room에서 접속을 해제할 때 호출된다.
// RoomReconnected(Room)        해당 Room에 재연결 되었을 때 호출된다.
// RoomError(RoomErrorEvent)    해당 Room에 Error가 발생했을 때 호출된다.
// RoomWeakConnection