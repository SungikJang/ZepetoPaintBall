import {Canvas, Color, GameObject, Rect, RenderMode, Sprite, Texture, Texture2D, Vector2, Vector3} from 'UnityEngine';
import {Image} from 'UnityEngine.UI';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Boolean} from 'System';
import {TMP_Text} from 'TMPro';
import IOC from '../IOC';
import Manager from './Manager';
import ControllerUI, { InterControllerUI } from '../UI/ControllerUI/ControllerUI';
import {InterStartUI} from '../UI/DefaultUI/StartUI';
import InGameUI from '../UI/DefaultUI/InGameUI';
import {ZepetoWorldHelper} from "ZEPETO.World";
import GameVoteUI from '../UI/DefaultUI/GameVoteUI';

abstract class Data<T> {
    // property
    public _data: T[] = [];
    private _count: number = 0;

    // getter setter
    public get Count() {
        return this._count;
    }

    public set Count(value) {
        this._count = value;
    }

    // method
    abstract Push(item: T): void;

    abstract Peek(): T | null;

    abstract Pop(): T | null;
}

export class StackGameObject extends Data<GameObject> {
    // method
    public Push(item: GameObject): void {
        this._data.push(item);
        this.Count = this.Count + 1;
    }

    public Peek(): GameObject | null {
        if (this.Count === 0) {
            return null;
        }
        return this._data[this.Count - 1];
    }

    public Pop(): GameObject | null {
        if (this.Count === 0) {
            return null;
        }
        this.Count = this.Count - 1;
        return this._data.pop();
    }

    public Delete(itemName): void {
        for (let i = 0; i < this._data.length; i++) {
            let popUpGo: GameObject = this._data[i];
            if (itemName === popUpGo.name) {
                this._data.splice(i, 1);
                this.Count = this.Count - 1;
                return;
            }
        }
    }

    public Search(itemName): GameObject | null {
        for (let i = 0; i < this._data.length; i++) {
            let popUpGo: GameObject = this._data[i];
            if (itemName === popUpGo.name) {
                return popUpGo;
            }
        }
        return null;
    }
}

export interface InterUIManager {
    Init(): void

    SetCanvas(go: GameObject, order: int): void

    ShowPopUpUI(uiName: string): GameObject

    DeletePopUpUI(uiName?: string): void

    ClosePopUpUI(): void

    CloseTargetPopUp(uiName: string): void

    ClearPopUpUI(): void

    ShowDefaultUI(uiName: string)

    CloseDefaultUI(uiName: string)
    
    DeleteDefaultUI(uiName: string)

    GetSprite(texture: Texture)

    get InGameUI(): InGameUI

    set InGameUI(value: InGameUI)

    get GameVoteUI()
    
    set GameVoteUI(value: GameVoteUI)

    get ControllerUI(): InterControllerUI

    set ControllerUI(value: InterControllerUI)

    get StartUI(): InterStartUI

    set StartUI(value: InterStartUI)

    get NowPopUpWeaponNum()
    
    set NowPopUpWeaponNum(value: string)

    get ScreenCenter()

    set ScreenCenter(value: Vector3)

    get SGCenter()

    set SGCenter(value: Vector3[])
}

export default class UIManager implements InterUIManager {
    private _rootUIPopUp: GameObject;
    private _rootUIPopUpDontDestroy: GameObject;
    private _popUpStack: StackGameObject;
    private _uIWorldSpace: GameObject;
    private _gameObjectUIWorldSpace: GameObject = null;
    public isAlertShowing: Boolean = false;
    public Stick: GameObject;
    public Jump: GameObject;
    public nowPopUpWeaponNum: string = "1";

    private inGameUI: InGameUI
    private controllerUI: InterControllerUI;
    private startUI: InterStartUI;
    private gameVoteUI: GameVoteUI
    private screenCenter: Vector3
    private sGCenter: Vector3[] = []
    
    public Init() {
        this._rootUIPopUp = GameObject.Find('RootUIPopUp');
        if (!this._rootUIPopUp) {
            console.log('RootUIPopUp이 씬에 없습니다');
        }

        this._rootUIPopUpDontDestroy = GameObject.Find('RootUIPopUpDontDestroy');
        if (!this._rootUIPopUpDontDestroy) {
            console.log('RootUIPopUpDontDestroy 씬에 없습니다');
        }

        this._popUpStack = new StackGameObject();
        this._uIWorldSpace = null;
    }

    public SetCanvas(go: GameObject, order: int): void {
        let canvasComponent: Canvas = go.GetComponent<Canvas>();
        if (!canvasComponent) {
            canvasComponent = go.AddComponent<Canvas>();
        }
        canvasComponent.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasComponent.overrideSorting = true;
        canvasComponent.sortingOrder = order;
        // canvasComponent.sortingOrder = this._canvasOrder;
        // this._canvasOrder += 1;
    }

    private CreatePopUpUI(uiName: string): GameObject {
        const go: GameObject = IOC.Instance.getInstance(Manager).Resource.Instantiate(`UI\\PopUpUI\\${uiName}`);
        go.transform.SetParent(this._rootUIPopUp.transform, false);
        this._popUpStack.Push(go);
        this.SetCanvas(go, 20 + this._popUpStack.Count);
        return go;
    }

    public ShowPopUpUI(uiName: string): GameObject {
        if (!uiName) {
            return null;
        }
        const goTransform = this._rootUIPopUp.transform.Find(uiName);
        if (!goTransform) {
            return this.CreatePopUpUI(uiName);
        } else {
            let go = goTransform.gameObject;
            go.SetActive(true);
            this.SetCanvas(go, 20 + this._popUpStack.Count);
            return go
        }
    }

    public DeletePopUpUI(uiName?: string): void {
        if (!uiName) {
            let popUpGo: GameObject | null = this._popUpStack.Peek() as GameObject;
            if (!popUpGo) {
                return;
            }
            this._popUpStack.Pop();
            IOC.Instance.getInstance(Manager).Resource.Destroy(popUpGo);
            popUpGo = null;
        }
        else{
            let goTransform = this._rootUIPopUp.transform.Find(uiName).gameObject;
            if (!goTransform) {
                return ;
            }
            this._popUpStack.Delete(uiName)
            IOC.Instance.getInstance(Manager).Resource.Destroy(goTransform);
            goTransform = null;
        }
    }

    public ClosePopUpUI(): void {
        let popUpGo: GameObject | null = this._popUpStack.Peek() as GameObject;
        if (!popUpGo) {
            return;
        }
        this._popUpStack.Pop();
        popUpGo.SetActive(false);
        popUpGo = null;
    }

    public CloseTargetPopUp(uiName: string): void {
        let popUpGo = this._popUpStack.Search(uiName) as GameObject;
        if (!popUpGo) {
            return;
        }
        this._popUpStack.Delete(uiName);
        IOC.Instance.getInstance(Manager).Resource.Destroy(popUpGo);
        popUpGo = null;
    }

    public ClearPopUpUI() {
        while (this._popUpStack.Count > 0) {
            let go = this._popUpStack.Pop();
            IOC.Instance.getInstance(Manager).Resource.Destroy(go);
        }
    }

    private CreateDefaultUI(uiName: string) {
        const go: GameObject = IOC.Instance.getInstance(Manager).Resource.Instantiate(`UI\\DefaultUI\\${uiName}`);
        go.transform.SetParent(this._rootUIPopUpDontDestroy.transform, false);
        this.SetCanvas(go, 10);
        return go;
    }

    public ShowDefaultUI(uiName: string) {
        const goTransform = this._rootUIPopUpDontDestroy.transform.Find(uiName);
        if (!goTransform) {
            this.CreateDefaultUI(uiName);
        } else {
            let go = goTransform.gameObject;
            go.SetActive(true);
            this.SetCanvas(go, 10);
        }
    }

    public CloseDefaultUI(uiName: string) {
        const goTransform = this._rootUIPopUpDontDestroy.transform.Find(uiName);
        if (goTransform) {
            const go = goTransform.gameObject;
            go.SetActive(false);
        }
    }

    public DeleteDefaultUI(uiName: string) {
        const goTransform = this._rootUIPopUpDontDestroy.transform.Find(uiName);
        if (goTransform) {
            const go = goTransform.gameObject;
            IOC.Instance.getInstance(Manager).Resource.Destroy(go);
        }
    }

    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }
    
    get GameVoteUI(){
        return this.gameVoteUI;
    }
    
    set GameVoteUI(value: GameVoteUI){
        this.gameVoteUI = value;
    }

    get InGameUI(){
        return this.inGameUI;
    }

    set InGameUI(value: InGameUI){
        this.inGameUI = value;
    }

    get ControllerUI(){
        return this.controllerUI;
    }

    set ControllerUI(value: InterControllerUI){
        this.controllerUI = value;
    }

    get StartUI(){
        return this.startUI;
    }

    set StartUI(value: InterStartUI){
        this.startUI = value;
    }

    get NowPopUpWeaponNum(){
        return this.nowPopUpWeaponNum;
    }

    set NowPopUpWeaponNum(value: string){
        this.nowPopUpWeaponNum = value;
    }
    
    get ScreenCenter(){
        return this.screenCenter
    }

    set ScreenCenter(value: Vector3){
        this.screenCenter = value
    }

    get SGCenter(){
        return this.sGCenter
    }

    set SGCenter(value: Vector3[]){
        this.sGCenter = value
    }
        
}
