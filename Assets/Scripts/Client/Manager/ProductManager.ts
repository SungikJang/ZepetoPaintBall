import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Transform, WaitUntil} from "UnityEngine";
import {ProductRecord, ProductService, ProductType, PurchaseType} from "ZEPETO.Product";
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import {Room, RoomData} from "ZEPETO.Multiplay";
import ProductSync from '../Network/ProductSync';
import Connector from '../Network/Connector';
import { Currency } from '../Enums';

export default class ProductManager {

    private _itemsCache: ProductRecord[] = [];
    private _itemsPackageCache: ProductRecord[] = []
    private _currencyPackageCache: ProductRecord[] = []
    private _multiplay: ZepetoWorldMultiplay;
    private _room : Room;
    private _productCache: Map<string, ProductRecord> = new Map<string, ProductRecord>();
    
    private _productSync: ProductSync;

    Init() {
        console.log("productmanager")
        ProductService.OnPurchaseCompleted.AddListener((product, response) => {
            console.log(`${response.productId} Purchase Completed`);
            if (product.ProductType == ProductType.Item) {
                this.RefreshBalance()
                this.RefreshInventory()
            }
            if (product.ProductType == ProductType.ItemPackage) {
                this.RefreshBalance()
                this.RefreshInventory()
            }
            if (product.ProductType == ProductType.CurrencyPackage) {
                this.RefreshBalance()
            }
        });
        ProductService.OnPurchaseFailed.AddListener((product, response) => {
            console.log(response.message);
        });
    }

    get ItemsCache(){
        return this._itemsCache
    }

    set ItemsCache(value: ProductRecord[]){
        this._itemsCache = value;
    }

    get ItemsPackageCache(){
        return this._itemsPackageCache
    }

    set ItemsPackageCache(value: ProductRecord[]){
        this._itemsPackageCache = value;
    }

    get CurrencyPackageCache(){
        return this._currencyPackageCache
    }

    set CurrencyPackageCache(value: ProductRecord[]){
        this._currencyPackageCache = value;
    }

    get ProductSyncinstance(){
        return this._productSync
    }

    set ProductSyncinstance(value: ProductSync){
        this._productSync = value;
    }

    get ProductCache(){
        return this._productCache
    }
    

    set ProductCache(value: Map<string, ProductRecord>){
        this._productCache = value
    }

    GainBalance(currencyId: string, quantity: number) {
        Connector.Instance.ReqToServer("onCredit", {currencyId: Currency.Gold, quantity: quantity})
    }

    UseBalance(currencyId: string, quantity: number) {
        Connector.Instance.ReqToServer("onDebit", {currencyId: Currency.Diamond, quantity: quantity})
    }

    PurchaseItem(ProductId: string) {
        const product = this._itemsCache.find(ir => ir.productId === ProductId);
        if (product) {
            ProductService.OpenPurchaseUI(product);
        }
        else{
            console.log(`Non-consumable product does not exist.`);
        }
    }

    PurchaseItemsPackage(PackageId: string) {
        const product = this._itemsPackageCache.find(ir => ir.productId === PackageId);
        if (product) {
            ProductService.OpenPurchaseUI(product);
        }
        else{
            console.log(`Non-consumable product does not exist.`);
        }
    }

    PurchaseCurrencyPackage(PackageId: string) {
        const product = this._currencyPackageCache.find(ir => ir.productId === PackageId);
        if (product) {
            ProductService.OpenPurchaseUI(product);
        }
        else{
            console.log(`Non-consumable product does not exist.`);
        }
    }

    RefreshBalance(){
        if(this._productSync){
            this._productSync.StartRefreshBalance();
        }
    }

    RefreshInventory(){
        if(this._productSync){
            this._productSync.StartRefreshInventory();
        }
    }

    SetMultiPlay(value: ZepetoWorldMultiplay){
        this._multiplay = value;
    }
}