export default class ResMgr extends cc.Component {
    public static Instance: ResMgr = null;

    private total: number = 0;
    private now: number = 0;

    private totalAb: number = 0;
    private nowAb: number = 0;

    private progressFunc: Function = null;
    private endFunc: Function = null;
    private abBunds = {};

    onLoad(): void {
        if(ResMgr.Instance === null) {
            ResMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }


    }

    public init(){
        console.log("init");
    }

    private loadAssetsBundle(abName: string, endFunc: Function): void {
        cc.assetManager.loadBundle(abName, (err, bundle)=>{
            if(err !== null) {
                console.log("[ResMgr]:Load AssetsBundle Error: " + abName);
                this.abBunds[abName] = null;
            } 
            else {
                console.log("[ResMgr]:Load AssetsBundle Success: " + abName);
                this.abBunds[abName] = bundle;
            }
            if(endFunc) {
                endFunc();
            }

        });
    }

    private loadRes(abBundle, url, typeClasss): void {
        abBundle.load(url, typeClasss, (error, asset)=>{
            this.now ++;
            if (error) {
                console.log("load Res " + url + " error: " + error);
            }
            else {
                console.log("load Res " + url + " success!");
            }

            if (this.progressFunc) {
                this.progressFunc(this.now, this.total);
            }

            console.log(this.now, this.total);
            if (this.now >= this.total) {   
                
                if (this.endFunc !== null) {
                    this.endFunc();
                }
            }
        });
    }

    private loadAssetsInAssetsBundle(resPkg): void {
        let pkg:any[];
        for(var key in resPkg) {
            pkg = resPkg[key];
            let urls:any;
            let typeClass:any; 
            let iLen = pkg.length;
            for(let i:number=0;i<iLen;i++){
                urls = pkg[i].urls;
                typeClass = pkg[i].assetType;
                let jLen = urls.length;
                for(var j = 0; j < jLen; j ++) {
                    this.loadRes(this.abBunds[key], urls[j], typeClass);
                }
            }
        }
    }

    loadScript(){
        
    }

    // resPkg = { ab?????????: {assetType: cc.Prefab, urls: ["??????1"]}};
    preloadResPkg(resPkg, progressFunc, endFunc): void {
        // step1: ???????????????ab?????????;
        this.total = 0;
        this.now = 0;

        this.totalAb = 0;
        this.nowAb = 0;

        this.progressFunc = progressFunc;
        this.endFunc = endFunc;
        let pkg:any[] = null;
        for(var key in resPkg) {
            pkg= resPkg[key];//??????
            this.totalAb ++; // ???ab?????????????????????
            let len = pkg.length;
            let urls:any[];
            for(let i:number=0;i<len;i++){
                urls = pkg[i].urls;
                this.total +=urls.length;// ???????????????????????????
            }
        }

        for(var key in resPkg) {
            this.loadAssetsBundle(key, ()=>{
                this.nowAb ++;
                if (this.nowAb === this.totalAb) {
                    this.loadAssetsInAssetsBundle(resPkg);
                }
            });
            
        }
        // end

        // step2: ??????????????????ab???????????????url,???????????????????????????????????????;
        // end
    }

    getAsset(abName, resUrl): any {
        var bondule = cc.assetManager.getBundle(abName);
        if (bondule === null) {
            console.log("[error]: " + abName + " AssetsBundle not loaded !!!");
            return null;
        }

        return bondule.get(resUrl);
    }
}
