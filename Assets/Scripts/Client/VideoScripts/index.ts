import { Camera, GameObject, YieldInstruction } from 'UnityEngine';
import { Button, Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { VideoResolutions, WorldVideoRecorder } from 'ZEPETO.World';

export default class WorldVideoRecorderExample extends ZepetoScriptBehaviour {
    // recorderCamera는 평소에 SetActive false였다가 StartRecording하면 true하고
    // recorderCamera가 true가 되면 (OnEnable) Update로 ZepetoCamera와 transform을 동기화해줘야함.
    // PostFeed나 공유하기 저장하기 등을 누르면 ~가 되었습니다.(완료버튼) UI를 생성해준다.
    // 녹화 중일때는 중앙 상단에 녹화중이라는 표시를 해준다. (빨간색 점 깜빡거리는 애니메이션, Recording...) 이렇게

    /* WorldVideoRecorder Video UI */
    public startRecordingButton: Button;
    public stopRecordingButton: Button;
    public saveVideoButton: Button;
    public shareVideoButton: Button;
    public createFeedButton: Button;
    public videoResultPanel: GameObject;
    public videoResultPanelExitButton: Button;

    /* Recorder Camera */
    public recorderCamera: Camera;

    private waitForSecond: YieldInstruction;
    public toastSuccessMessage: GameObject;
    public toastErrorMessage: GameObject;

    Start() {
        try {
            this.startRecordingButton.onClick.AddListener(() => {
                this.recorderCamera.gameObject.SetActive(true);
                this.stopRecordingButton.gameObject.SetActive(true);
                this.startRecordingButton.gameObject.SetActive(false);
                if (false == WorldVideoRecorder.StartRecording(this.recorderCamera, VideoResolutions.W1280xH720, 15))
                    return;
                this.StartCoroutine(this.CheckRecording());
            });

            this.stopRecordingButton.onClick.AddListener(() => {
                this.stopRecordingButton.gameObject.SetActive(false);
                this.startRecordingButton.gameObject.SetActive(true);
                this.videoResultPanel.gameObject.SetActive(true);

                if (false == WorldVideoRecorder.IsRecording()) {
                    return;
                }
                WorldVideoRecorder.StopRecording();
                this.recorderCamera.gameObject.SetActive(false);
            });

            this.saveVideoButton.onClick.AddListener(() => {
                if (false == WorldVideoRecorder.IsRecording()) {
                    WorldVideoRecorder.SaveToCameraRoll((result) => {
                        this.StartCoroutine(this.ShowToastMessage('Saved!'));
                    });
                }
            });

            this.shareVideoButton.onClick.AddListener(() => {
                if (false == WorldVideoRecorder.IsRecording()) {
                    WorldVideoRecorder.Share((result) => {
                        //console.log(`${result}`);
                    });
                }
            });

            this.createFeedButton.onClick.AddListener(() => {
                if (false == WorldVideoRecorder.IsRecording()) {
                    WorldVideoRecorder.CreateFeed('[contents]', (result) => {
                        this.StartCoroutine(this.ShowToastMessage('Upload Complete!'));
                    });
                }
            });

            this.videoResultPanelExitButton.onClick.AddListener(() => {
                this.videoResultPanel.SetActive(false);
                this.recorderCamera.gameObject.SetActive(false);
            });
        }
        catch (e) {
            console.error(e);
        }
    }

    *CheckRecording() {
        try {
            while (WorldVideoRecorder.IsRecording()) {
                yield null;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    *ShowToastMessage(text: string) {
        try {
            yield this.waitForSecond;
            let toastMessage: GameObject = null;
            if (text == 'Failed') toastMessage = GameObject.Instantiate<GameObject>(this.toastErrorMessage);
            else toastMessage = GameObject.Instantiate<GameObject>(this.toastSuccessMessage);
            toastMessage.transform.SetParent(this.videoResultPanel.transform);

            toastMessage.GetComponentInChildren<Text>().text = text;
            GameObject.Destroy(toastMessage, 2);
        }
        catch (e) {
            console.error(e);
        }
    }
}
