import { LightningElement } from 'lwc';
import findAddress from '@salesforce/apex/OnDemandBookingFlowController.findAddress';
import checkEligibility from '@salesforce/apex/OnDemandBookingFlowController.checkEligibility';
import isguest from '@salesforce/user/isGuest';
import SVG_SYMBOL from '@salesforce/resourceUrl/symbols'; //icons svg
import OnDemandWasteIcon from '@salesforce/resourceUrl/OnDemandWasteIcon'; //icons svg


export default class OnDemandRemainingEntitlements extends LightningElement {

    
    //Selection Icons
    checkUrl = `${SVG_SYMBOL}#check`
    iconEWatse = `${OnDemandWasteIcon}/EWaste.svg#Layer_1`;
    iconMatresses = `${OnDemandWasteIcon}/Mattresses.svg#Layer_1`;
    iconSkipBin = `${OnDemandWasteIcon}/SkipBin.svg#Layer_1`;
    iconWhitegoods = `${OnDemandWasteIcon}/Whitegoods.svg#Layer_1`;

    selectAddress;
    selectedServiceApiName;
    address = [];
    loaded = true;
    get addressName(){
        if(this.address.length == 1){
            return this.address[0].title;
        }
        return '';
    }
    get addressId(){
        if(this.address.length == 1){
            return this.address[0].id;
        }
        return '';
    }
    get propertyId(){
        if(this.address.length == 1){
            return this.address[0].secondaryId;
        }
        return '';
    }
    isExtraService;
    confirmOverride;
    showEntitlementInfo = false;

     handleEntitlementOverride(event){
        this.confirmOverride = event.detail;
    }

    handleAddressChange(event){
        //skip bin eligibility check
        this.address = event.detail;
        console.log('handleAddressChange addressId', this.addressId);
        this.loaded = false;

        if(this.addressName != ''){
                
                findAddress({addressId:this.addressId})
                    .then((result) => {
                        this.loaded = true;
                        console.log("findAddress result",result);
                        this.selectAddress = result;
                    })
                    .catch(
                        (error) => {
                        this.serviceEligible = false;
                        console.log(error);
                        this.loaded = true;
                        const event = new ShowToastEvent({
                            title: 'Service error',
                            message: error.body.message,
                            variant: 'error',
                            mode: 'sticky'
                        });
                    }) ;

        } else {
            this.loaded = true;
            this.serviceEligible = false;
        }
    }
}