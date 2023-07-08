import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ProductService, ProductType, ProductPurchaseButton, PurchaseType} from "ZEPETO.Product";
import {WaitForSeconds, WaitUntil} from "UnityEngine";
import Manager from '../Manager/Manager';
import {CurrencyService} from "ZEPETO.Currency";
import { Currency } from '../Enums';
import {InventoryRecord, InventoryService} from "ZEPETO.Inventory";
import {RoomData} from "ZEPETO.Multiplay";
import Connector from './Connector';
import Utils from "../Utils/index"
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import MyPlayerController from '../MyPlayerController/MyPlayerController';

export default class ProductSync extends ZepetoScriptBehaviour {
    
    public multiplay: ZepetoWorldMultiplay

    Start() {
        this.StartCoroutine(this.LoadAllItems())//ItemsCache Product
        //this.StartRefreshBalance();
    }


    private* LoadAllItems() {
        const request = ProductService.GetProductsAsync();
        yield new WaitUntil(() => request.keepWaiting == false);
        Manager.Product.ProductSyncinstance = this;
        Manager.Product.SetMultiPlay(this.multiplay)
        if (request.responseData.isSuccess) {
            Manager.Product.ItemsCache = [];
            request.responseData.products.forEach((pr) => {
                if (pr.ProductType == ProductType.Item) {
                    Manager.Product.ItemsCache.push(pr);
                }
                if (pr.ProductType == ProductType.ItemPackage) {
                    Manager.Product.ItemsPackageCache.push(pr);
                }
                if (pr.ProductType == ProductType.CurrencyPackage) {
                    Manager.Product.CurrencyPackageCache.push(pr);
                }
            });

            if (Manager.Product.ItemsCache.length == 0) {
                console.warn("no Item information");
                return;
            }
        } 
        else {
            console.warn("Product Load Failed");
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
        const request = CurrencyService.GetUserCurrencyBalancesAsync();
        yield new WaitUntil(()=>request.keepWaiting == false);
        if(request.responseData.isSuccess) {
            let g = request.responseData.currencies?.ContainsKey(Currency.Gold) ? request.responseData.currencies?.get_Item(Currency.Gold).toString() :"0";
            MyPlayerController.Data.MyGold = Number(g)
            let d = request.responseData.currencies?.ContainsKey(Currency.Diamond) ? request.responseData.currencies?.get_Item(Currency.Diamond).toString() :"0";
            MyPlayerController.Data.MyDia = Number(d)
        }
    }
    
    private *RefreshOfficialCurrencyUI(){
        console.log('ocasrg546yujdfygkghilo')
        const request = CurrencyService.GetOfficialCurrencyBalanceAsync();
        yield new WaitUntil(()=>request.keepWaiting == false);
        let z = request.responseData.currency.quantity.toString();
        MyPlayerController.Data.MyZem = Number(z);
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
                    let ind: number = Number(Utils.ExtractNumberStr(ir.productId))
                    MyPlayerController.Data.MyWeaponInfoArr[ind - 1] = "O"
                }
            })

            // items.forEach((ir, index) => {
            //     // If there are zero consumable items, delete them from the inventory.
            //     if (ir.quantity <= 0 && Manager.Product.ProductCache.get(ir.productId).PurchaseType == PurchaseType.Consumable) {
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
}