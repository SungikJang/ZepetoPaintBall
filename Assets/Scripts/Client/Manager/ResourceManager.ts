import { GameObject, Resources, Sprite, Texture2D, Rect, Vector2, TextAsset } from 'UnityEngine';
import * as UnityEngine from 'UnityEngine';

export interface InterResourceManager {
    Load(path: string): UnityEngine.Object

    LoadSprite(path: string): Sprite

    LoadData(path: string): any

    Instantiate(path: string): GameObject

    Destroy(go: GameObject, t: number): void
    
    Init(): void;
}

export default class ResourceManager implements InterResourceManager{
    private _rootPrefab: GameObject = null;

    // method
    public Load(path: string): UnityEngine.Object {
        const object = Resources.Load(path);
        if (!object) {
            console.log(`해당 경로에 오브젝트가 없습니다: ${path}`);
            return null;
        }

        return object;
    }
    public LoadSprite(path: string): Sprite {
        let imageSource = Resources.Load<Texture2D>('Images\\' + path);
        if (!imageSource) {
            console.log(`해당 경로에 스프라이트가 없습니다: ${path}`);
            imageSource = Resources.Load<Texture2D>('Images/Icon/test');
            // return null;
        }

        const rect = new Rect(0, 0, imageSource.width, imageSource.height);
        const sprite = Sprite.Create(imageSource, rect, new Vector2(0, 0));

        return sprite;
    }
    public LoadData(path: string): any {
        const JsonData = Resources.Load<TextAsset>('Data\\' + path);
        if (!JsonData) {
            console.log(`해당 경로에 json 파일이 없습니다: ${path}`);
            return null;
        }

        return JSON.parse(JsonData.toString());
    }
    public Instantiate(path: string): GameObject {
        let go: GameObject = null;
        let origin_prefab = Resources.Load<GameObject>(path);
        if (!origin_prefab) {
            console.log(`해당 경로에 프리팹이 없습니다: ${path}`);
            return null;
        }

        go = UnityEngine.Object.Instantiate(origin_prefab) as GameObject;
        go.name = origin_prefab.name;
        go.transform.SetParent(this._rootPrefab.transform);

        return go;
    }
    public Destroy(go: GameObject, t: number = 0): void {
        try {
            if (go === null) {
                return;
            }
            UnityEngine.Object.Destroy(go, t);
        } catch (e) {
            console.error(e);
        }
    }

    // life cycle
    public Init(): void {
        this._rootPrefab = GameObject.Find('RootPrefab');
        if (!this._rootPrefab) {
            console.log('RootPrefab이 씬에 없습니다');
        }
    }
}
