import {Canvas, Color, GameObject, RenderMode, Sprite} from 'UnityEngine';
import {Image} from 'UnityEngine.UI';
import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {Boolean} from 'System';
import {TMP_Text} from 'TMPro';
import IOC from '../IOC';
import Manager from './Manager';

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

    DeletePopUpUI(): void

    ClosePopUpUI(): void

    CloseTargetPopUp(uiName: string): void

    ClearPopUpUI(): void

    ShowDefaultUI(uiName: string)

    CloseDefaultUI(uiName: string)

    DeleteDefaultUI(uiName: string)
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
        go.transform.SetParent(this._rootUIPopUp.transform);
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

    public DeletePopUpUI(): void {
        let popUpGo: GameObject | null = this._popUpStack.Peek() as GameObject;
        if (!popUpGo) {
            return;
        }
        this._popUpStack.Pop();
        IOC.Instance.getInstance(Manager).Resource.Destroy(popUpGo);
        popUpGo = null;
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
        go.transform.SetParent(this._rootUIPopUpDontDestroy.transform);
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
}
