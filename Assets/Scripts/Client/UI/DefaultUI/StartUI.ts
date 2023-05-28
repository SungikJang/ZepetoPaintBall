import { GameObject } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class StartUI extends ZepetoScriptBehaviour {
    public inventoryBtn: Button;
    public weaponChestBtn: Button;
    public passBtn: Button;
    public coinsBtn: Button;
    
    public GameStartBtn: Button;

    public inventory: GameObject;
    public inventoryBottom: GameObject;
    public weaponChest: GameObject;
    public weaponChestBottom: GameObject;
    public pass: GameObject;
    public passBottom: GameObject;
    public coins: GameObject;
    public coinsBottom: GameObject;
    
    private nowPage: GameObject;
    private nowPageBottom: GameObject;
    
    public Items: GameObject;

    Start() {
        this.inventory.SetActive(true);
        this.nowPage = this.inventory;
        this.nowPageBottom = this.inventoryBottom;
        this.inventoryBtn.onClick.AddListener(() => {
            if(!this.inventory.activeSelf){
                this.nowPage.SetActive(false);
                this.nowPageBottom.SetActive(false);
                this.inventory.SetActive(true);
                this.inventoryBottom.SetActive(true);
                this.nowPage = this.inventory;
                this.nowPageBottom = this.inventoryBottom;
            }
        });
        this.weaponChestBtn.onClick.AddListener(() => {
            if(!this.weaponChest.activeSelf){
                this.nowPage.SetActive(false);
                this.nowPageBottom.SetActive(false);
                this.weaponChest.SetActive(true);
                this.weaponChestBottom.SetActive(true);
                this.nowPage = this.weaponChest;
                this.nowPageBottom = this.weaponChestBottom;
            }
        });
        this.passBtn.onClick.AddListener(() => {
            if(!this.pass.activeSelf){
                this.nowPage.SetActive(false);
                this.nowPageBottom.SetActive(false);
                this.pass.SetActive(true);
                this.passBottom.SetActive(true);
                this.nowPage = this.pass;
                this.nowPageBottom = this.passBottom;
            }
        });
        this.coinsBtn.onClick.AddListener(() => {
            if(!this.coins.activeSelf){
                this.nowPage.SetActive(false);
                this.nowPageBottom.SetActive(false);
                this.coins.SetActive(true);
                this.coinsBottom.SetActive(true);
                this.nowPage = this.coins;
                this.nowPageBottom = this.coinsBottom;
            }
        });

        this.GameStartBtn.onClick.AddListener(() => {
            this.gameObject.SetActive(false);
            // 플레이어 이동시키고 동기화 시작해야함
        });
    }

}