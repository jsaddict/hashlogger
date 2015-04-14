function updateLiveData(){
	if(isLiveData == false){
		return;
	}
	fetchCurrentData(function(err, data){
		if(err){
			// postInfo('err','Error fetching live data', err);
		}else{
			if(data != null){
				if(data.length != 0){
					plotNow(false, data);
				}	
			}
			if(stopUpdation == false){
		        setTimeout(updateLiveData ,plotInterval);
		    }			
		}		
	})	
}
function startLiveDataUpdater(){
	isLiveData = true;
	fetchRecentData(function(err, data){
		if(err){
			// postInfo('err','Error fetching recent data', err);
		}else{
			plotNow(true, data);
			updateLiveData();
		}
	})
}