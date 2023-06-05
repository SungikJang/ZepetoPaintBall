import {Camera, Canvas, Color, Color32, GameObject, RenderMode} from 'UnityEngine';
import {ZepetoPlayers} from 'ZEPETO.Character.Controller';
import IOC from '../IOC';
import Manager, { InterManager } from './Manager';

class Stack<GameObject> {
    // property
    public _data: GameObject[] = [];
    private _count: int = 0;

    // getter setter
    public get Count() {
        return this._count;
    }

    // method
    public Push(item: GameObject): void {
        this._data.push(item);
        this._count += 1;
    }
    public Peek(): GameObject {
        return this._data[this._count - 1];
    }
    public Pop(): GameObject {
        this._count -= 1;
        return this._data.pop();
    }
}

export interface InterUIManager {
    SetCanvas(go: GameObject): void

    ShowUIPopUp(uiName: string): GameObject

    ShowUIWorldSpace(name: string, parentGameObject: GameObject): GameObject

    ClosePopUp(): void

    CloseTargetPopUp(targetUiName: string): void

    CloseWorldSpace(): void

    Init(): void;
}

export default class UIManager implements InterUIManager{
    // property
    private _canvasOrder = 10;
    private _rootUIPopUp: GameObject = null;
    private _rootUIPopUpDontDestroy: GameObject = null;
    private _gameObjectStackOfUIPopUp: Stack<GameObject> = new Stack<GameObject>();
    private _gameObjectUIWorldSpace: GameObject = null;

    private Manager: InterManager;

    // method
    public SetCanvas(go: GameObject): void {
        let canvasComponent: Canvas = go.GetComponent<Canvas>();
        if (!canvasComponent) {
            canvasComponent = go.AddComponent<Canvas>();
        }

        canvasComponent.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasComponent.overrideSorting = false;
        canvasComponent.sortingOrder = this._canvasOrder;

        this._canvasOrder += 1;
    }
    public ShowUIPopUp(uiName: string): GameObject {
        if (!uiName) {
            return;
        }

        if (this._rootUIPopUpDontDestroy) {
            const inactiveGoTransform = this._rootUIPopUpDontDestroy.transform.Find(uiName);
            if (inactiveGoTransform) {
                inactiveGoTransform.gameObject.SetActive(true);
                this._gameObjectStackOfUIPopUp.Push(inactiveGoTransform.gameObject);

                return inactiveGoTransform.gameObject;
            }
        } else {
            console.log('RootUIPopUpDontDestroy는 씬에 있어야 합니다. 문제를 해결하세요');
        }

        if (this._rootUIPopUp) {
            const inactiveGoTransform = this._rootUIPopUpDontDestroy.transform.Find(uiName);

            if (!inactiveGoTransform) {
                const go: GameObject = this.Manager.Resource.Instantiate(`UI\\${uiName}`);
                go.transform.SetParent(this._rootUIPopUp.transform);

                if (!uiName.includes("Alert")) {
                    this._gameObjectStackOfUIPopUp.Push(go);
                }

                return go;
            }
        }
    }
    public ShowUIWorldSpace(name: string, parentGameObject: GameObject): GameObject {
        if (!name || !parentGameObject) {
            return;
        }

        if (this._gameObjectUIWorldSpace !== null) {
            this.CloseWorldSpace();
        }

        const go: GameObject = this.Manager.Resource.Instantiate(`UI\\${name}`);
        go.transform.SetParent(parentGameObject.transform);

        const canvas = go.GetComponent<Canvas>();
        canvas.renderMode = RenderMode.WorldSpace;
        canvas.worldCamera = ZepetoPlayers.instance.ZepetoCamera.camera;

        this._gameObjectUIWorldSpace = go;

        return go;
    }
    public ClosePopUp(): void {
        if (this._gameObjectStackOfUIPopUp.Count == 0) {
            return;
        }

        let popUpGo: GameObject | null = this._gameObjectStackOfUIPopUp.Pop();

        if (this._rootUIPopUpDontDestroy) {
            let nameOfGameObject = popUpGo.name;
            const activeGoTransform = this._rootUIPopUpDontDestroy.transform.Find(nameOfGameObject);
            if (activeGoTransform) {
                activeGoTransform.gameObject.SetActive(false);
                return;
            }
        } else {
            console.log('RootUIPopUpDontDestroy는 씬에 있어야 합니다. 문제를 해결하세요');
        }

        this.Manager.Resource.Destroy(popUpGo, 0);
        popUpGo = null;
    }
    public CloseTargetPopUp(targetUiName: string): void {
        if (this._gameObjectStackOfUIPopUp.Count == 0) {
            return;
        }

        for (let i = 0; i < this._gameObjectStackOfUIPopUp._data.length; i++) {
            let popUpGo = this._gameObjectStackOfUIPopUp._data[i];
            if (targetUiName === popUpGo.name) {
                if (this._rootUIPopUpDontDestroy) {
                    const activeGoTransform = this._rootUIPopUpDontDestroy.transform.Find(targetUiName);
                    if (activeGoTransform) {
                        activeGoTransform.gameObject.SetActive(false);
                        this._gameObjectStackOfUIPopUp._data.splice(i, 1);
                        return;
                    }
                } else {
                    console.log('RootUIPopUpDontDestroy는 씬에 있어야 합니다. 문제를 해결하세요');
                }

                this._gameObjectStackOfUIPopUp._data.splice(i, 1);
                this.Manager.Resource.Destroy(popUpGo, 0);
                popUpGo = null;
                return;
            }
        }
    }
    public CloseWorldSpace(): void {
        if (this._gameObjectUIWorldSpace === null) {
            return;
        }

        let worldSpaceGo: GameObject | null = this._gameObjectUIWorldSpace;
        this.Manager.Resource.Destroy(worldSpaceGo, 0);
        this._gameObjectUIWorldSpace = null;
        worldSpaceGo = null;
    }


    // life cycle
    public Init(): void {
        this.Manager = IOC.Instance.getInstance<InterManager>(Manager);
        // 이거 무조건 씬에 있어야 함
        this._rootUIPopUp = GameObject.Find('RootUIPopUp');
        if (!this._rootUIPopUp) {
            console.log('RootUIPopUp는 씬에 있어야 합니다');
            return;
        }
        this._rootUIPopUpDontDestroy = GameObject.Find('RootUIPopUpDontDestroy');
        if (!this._rootUIPopUpDontDestroy) {
            console.log('RootUIPopUpDontDestroy는 씬에 있어야 합니다');
        }
    }
}