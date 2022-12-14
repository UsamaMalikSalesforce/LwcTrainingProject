import { publish,MessageContext } from 'lightning/messageService';
import BEAR_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/BearListUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement,wire } from 'lwc';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
//Apex calling method
//import getAllBears from '@salesforce/apex/BearController.getAllBears';
import searchBears from '@salesforce/apex/BearController.searchBears';

export default class BearList extends NavigationMixin(LightningElement) {
   // bears;
    //error= false;
    appResources = {
        bearSilhouette:`${ursusResources}/standing-bear-silhouette.png`
    };
    searchTerm = '';
    bears;
    @wire(MessageContext) messageContext;
    @wire(searchBears,{searchTerm:'$searchTerm'})
    loadBears(result)
    {
        this.bears = result;
        if(result.data)
        {
            const message = {
                bears: result.data
            };
            publish(this.messageContext,BEAR_LIST_UPDATE_MESSAGE,message);
        }
    }    
    //calling apex by wire with params
    @wire(searchBears,{searchTerm:'$searchTerm'}) bears;
    handleSearchTermChange(event)
    {
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        this.delayTimeout = setTimeout(()=>{
            this.searchTerm = searchTerm
        },300);
    }
    get hasResults()
    {
        return (this.bears.data.length > 0);
    }
    handleBearView(event)
    {
        const bearId = event.detail;
//        alert('parent: '+bearId);
        
        // Navigate to bear record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: bearId,
				objectApiName: 'Bear__c',
				actionName: 'view',
			},
		});
    }


}