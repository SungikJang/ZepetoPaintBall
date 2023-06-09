import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ProductService, ProductType, ProductPurchaseButton, PurchaseType} from "ZEPETO.Product";
import {WaitForSeconds, WaitUntil} from "UnityEngine";
import IOC from '../IOC';
import Manager, { InterManager } from '../Manager/Manager';
import {CurrencyService} from "ZEPETO.Currency";
import { InterMyPlayerController, MyPlayerController } from '../MyPlayer/MyPalyerController';
import { Currency } from '../Enums';
import {InventoryRecord, InventoryService} from "ZEPETO.Inventory";
import {RoomData} from "ZEPETO.Multiplay";
import Connector from './Connector';
import Utils from "../Utils/index"
import {ZepetoWorldMultiplay} from "ZEPETO.World";

export default class ProductSync extends ZepetoScriptBehaviour {
    public myPlayerController: InterMyPlayerController;
    public manager: InterManager;
    public multiplay: ZepetoWorldMultiplay

    Start() {
        this.StartCoroutine(this.LoadAllItems())//ItemsCache Product
        this.StartCoroutine(this.SetInstance())//ItemsCache Product
        this.StartCoroutine(this.WaitForStartUI())
        //this.StartRefreshBalance();
    }


    private* LoadAllItems() {
        const request = ProductService.GetProductsAsync();
        yield new WaitUntil(() => request.keepWaiting == false);
        while(true){
            if(this.manager){
                if (request.responseData.isSuccess) {
                    this.manager.Product.ItemsCache = [];
                    request.responseData.products.forEach((pr) => {
                        if (pr.ProductType == ProductType.Item) {
                            this.manager.Product.ItemsCache.push(pr);
                        }
                        if (pr.ProductType == ProductType.ItemPackage) {
                            this.manager.Product.ItemsPackageCache.push(pr);
                        }
                        if (pr.ProductType == ProductType.CurrencyPackage) {
                            this.manager.Product.CurrencyPackageCache.push(pr);
                        }
                    });

                    if (this.manager.Product.ItemsCache.length == 0) {
                        console.warn("no Item information");
                        return;
                    }
                    return;
                } else { 
                    console.warn("Product Load Failed");
                }
            }
            yield new WaitForSeconds(0.2);
        }
    }

    private* OnClickPurchaseItemImmediately(productId: string) {
        const request = ProductService.PurchaseProductAsync(productId);
        yield new WaitUntil(() => request.keepWaiting == false);
        if (request.responseData.isSuccess) {
            // is purchase success
        } else {
            // is purchase fail
        }
    }

    private *RefreshBalance(){
        console.log('caaadasdawawwcascasd')
        const request = CurrencyService.GetUserCurrencyBalancesAsync();
        yield new WaitUntil(()=>request.keepWaiting == false);
        if(request.responseData.isSuccess) {
            let g = request.responseData.currencies?.ContainsKey(Currency.Gold) ? request.responseData.currencies?.get_Item(Currency.Gold).toString() :"0";
            this.myPlayerController.MyPlayerData.MyGold = Number(g)
            let d = request.responseData.currencies?.ContainsKey(Currency.Diamond) ? request.responseData.currencies?.get_Item(Currency.Diamond).toString() :"0";
            this.myPlayerController.MyPlayerData.MyDia = Number(d)
        }
    }
    
    private *RefreshOfficialCurrencyUI(){
        console.log('ocasrg546yujdfygkghilo')
        const request = CurrencyService.GetOfficialCurrencyBalanceAsync();
        yield new WaitUntil(()=>request.keepWaiting == false);
        let z = request.responseData.currency.quantity.toString();
        this.myPlayerController.MyPlayerData.MyZem = Number(z);
    }
    
    public StartRefreshBalance(){
        this.StartCoroutine(this.RefreshBalance())
        this.StartCoroutine(this.RefreshOfficialCurrencyUI())
    }

    public StartRefreshInventory(){
        this.StartCoroutine(this.RefreshInventory())
    }

    private * RefreshInventory(){
        console.log('inv')
        const request = InventoryService.GetListAsync();
        yield new WaitUntil(()=>request.keepWaiting == false);
        if(request.responseData.isSuccess) {
            const items: InventoryRecord[] = request.responseData.products;

            items.forEach((ir, index) => {
                if(ir.productId.includes("gun")){
                    if(!this.myPlayerController){
                        this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
                    }
                    let ind: number = Number(Utils.ExtractNumberStr(ir.productId))
                    this.myPlayerController.MyPlayerData.MyWeaponInfoArr[ind - 1] = "O"
                }
            })

            // items.forEach((ir, index) => {
            //     // If there are zero consumable items, delete them from the inventory.
            //     if (ir.quantity <= 0 && IOC.Instance.getInstance<InterManager>(Manager).Product.ProductCache.get(ir.productId).PurchaseType == PurchaseType.Consumable) {
            //         // remove inventory
            //         const data = new RoomData();
            //         data.Add("productId", ir.productId);
            //         Connector.Instance.ReqToServer("onRemoveInventory", {productId: ir.productId});
            //         return;
            //     }
            //
            // });
        }
    }
    
    private * WaitForStartUI(){
        while(true){
            console.log("1")
            if(!this.manager){
                this.manager = IOC.Instance.getInstance<InterManager>(Manager)
                console.log("2")
            }
            if(this.manager.UI.StartUI){
                console.log("3")
                this.StartRefreshBalance();
                this.StartRefreshInventory();
                return
            }
            yield new WaitForSeconds(0.2);
        }
    }
    
    * SetInstance(){
        while(true){
            if(!this.manager && !this.myPlayerController){
                this.manager = IOC.Instance.getInstance<InterManager>(Manager)
                this.myPlayerController = IOC.Instance.getInstance<InterMyPlayerController>(MyPlayerController);
                this.manager.Product.ProductSyncinstance = this.gameObject.GetComponent<ProductSync>();
                this.manager.Product.SetMultiPlay(this.multiplay)
                return
            }
            yield new WaitForSeconds(0.2);
        }
    }
}