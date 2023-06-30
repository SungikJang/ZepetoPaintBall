import { Camera, CameraClearFlags, Color, GameObject, RenderTexture, WaitForEndOfFrame } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldContent } from 'ZEPETO.World';
import UIController from './UIController';

export default class ScreenShotController extends ZepetoScriptBehaviour {
    private camera: Camera;

    private preClearFlags: CameraClearFlags;
    private preBackgroundColor: Color;

    public renderTexture: RenderTexture;

    // 투명 배경 촬영용 background canvas
    public backgroundCanvas: GameObject;
    public uiControllerObject: GameObject;
    private uiController: UIController;
    public feedMessage: string;

    Awake() {
        try {
            this.uiController = this.uiControllerObject.GetComponent<UIController>();
        } catch (e) {
            console.error(e);
        }
    }

    public SetScreenShotCamera(camera: Camera) {
        this.camera = camera;
    }

    public TakeScreenShot(isBackgroundOn: boolean) {
        if (isBackgroundOn) {
            this.TakeScreenShotWithBackground();
        } else {
            this.TakeScreenShotWithoutBackground();
        }
    }
    private TakeScreenShotWithBackground() {
        // 타겟 텍스처를 지정하고 카메라 렌더
        this.camera.targetTexture = this.renderTexture;
        this.StartCoroutine(this.RenderTargetTextureWithBackground());
    }
    private TakeScreenShotWithoutBackground() {
        // 백그라운드 캔버스를 스크린샷을 찍는 동안 비활성화
        this.backgroundCanvas.gameObject.SetActive(false);

        // 1. 타겟 텍스처를 지정하고 스크린샷 이전 카메라 FLag, Color값을 저장
        this.camera.targetTexture = this.renderTexture;
        this.preClearFlags = this.camera.clearFlags;
        this.preBackgroundColor = this.camera.backgroundColor;

        // 2. 카메라의 배경을 solidColor로 채우고, background Color를 투명하게 만듦
        this.camera.clearFlags = CameraClearFlags.SolidColor;
        this.camera.backgroundColor = new Color(0, 0, 0, 0);

        // 3. 카메라 렌더
        this.StartCoroutine(this.RenderTargetTextureWithoutBackground());
    }
    *RenderTargetTextureWithBackground() {
        yield new WaitForEndOfFrame();
        this.camera.Render();
        this.camera.targetTexture = null;
    }
    *RenderTargetTextureWithoutBackground() {
        yield new WaitForEndOfFrame();
        this.camera.Render();

        // 4. 기존 설정을 되돌림
        this.camera.targetTexture = null;
        this.camera.backgroundColor = this.preBackgroundColor;
        this.camera.clearFlags = this.preClearFlags;

        // 5. 백그라운드 캔버스를 스크린샷을 찍는 동안 다시 활성화
        this.backgroundCanvas.gameObject.SetActive(true);
    }

    public SaveScreenShot() {
        //스크린샷 저장
        ZepetoWorldContent.SaveToCameraRoll(this.renderTexture, (result: boolean) => {
            //console.log(`${result}`);
        });
    }
    public ShareScreenShot() {
        ZepetoWorldContent.Share(this.renderTexture, (result: boolean) => {
            //console.log(`${result}`);
        });
    }
    public CreateFeedScreenShot() {
        ZepetoWorldContent.CreateFeed(this.renderTexture, this.feedMessage, (result: boolean) => { });
    }
}
