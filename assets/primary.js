    function slugify(str) {
        return String(str)
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim() 
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }    

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }      
    
    function searchOrganizations(render,show_tag){
	    
        let query = 'api';
        if(document.getElementById('api-search').value != ''){                        
            query = document.getElementById('api-search').value;
        }

        const options = {
                method: 'get',
                headers: {
                    "Accept": "application/json"
                }
            };	

        fetch(search_url,options)
            .then(function(response) {
                if (!response.ok) {
                    console.log('Error with Status Code: ' + response.status);
                    return;
                }
                response.json().then(function(search) {	                        

                    search = sortByKey(search,'name');

                    let rows = '';
                    if(search.length > 0){
                        for (let i = 0; i < search.length; i++) {

                            //console.log(search[i]);

                            var show = 0;
                            if(show_tag == 'All'){
                                show = 1;
                            }
                            else{
                                if(search[i].tags){
                                    for (let j = 0; j < search[i].tags.length; j++) {
                                        if(search[i].tags[j] == show_tag){
                                            show = 1;
                                        }
                                    }
                                }
                            }

                            if(search[i].name != '' && show == 1){

                                var github_url = '';
                                var linkedin_url = '';
                                var website_url = '';
                                if(search[i].common){
                                    for (let j = 0; j < search[i].common.length; j++) {
                                        if(search[i].common[j].type == 'LinkedIn'){
                                        linkedin_url = search[i].common[j].url;
                                        }
                                        if(search[i].common[j].type == 'GitHubOrganization'){
                                        github_url = search[i].common[j].url;
                                        }    
                                        if(search[i].common[j].type == 'Website'){
                                        website_url = search[i].common[j].url;
                                        }                                                                      
                                    }
                                }                                

                                // Crude little filter
                                if(query == 'api' || query == ''){
                                    var showMe = 1;
                                }
                                else{
                                    var showMe = 0;
                                }                            
                                //console.log(document.getElementById('search-name').checked);
                                if(document.getElementById('search-name').checked){                        
                                    if(search[i].name.includes(query)){
                                        showMe = 1;
                                    }
                                }        
                                //console.log(document.getElementById('search-description').checked);
                                if(document.getElementById('search-description').checked){                        
                                    if(search[i].description.includes(query)){
                                        showMe = 1;
                                    }
                                }        
                                //console.log(document.getElementById('search-tags').checked);
                                if(document.getElementById('search-tags').checked){      
                                    if(search[i].tags.length > 0){               
                                        for (let j = 0; j < search[i].tags.length; j++) {
                                            if(search[i].tags[j]){
                                                if(search[i].tags[j].includes(query)){
                                                    showMe = 1;
                                                }                     
                                            }               
                                        }
                                    }
                                }   
                                //console.log(document.getElementById('search-notes').checked);
                                if(document.getElementById('search-notes').checked){                        
                                    if(search[i].notes && search[i].notes.length > 0){   
                                        for (let j = 0; j < search[i].notes.length; j++) {
                                            if(search[i].notes[j].message.includes(query)){
                                                showMe = 1;
                                            }                                    
                                        }
                                    }
                                }   
                                
                                //console.log(document.getElementById('search-features').checked);
                                if(document.getElementById('search-features').checked){                        
                                    if(search[i].features && search[i].features.length > 0){   
                                        for (let j = 0; j < search[i].features.length; j++) {
                                            if(search[i].features[j].name){
                                                if(search[i].features[j].name.includes(query)){
                                                    showMe = 1;
                                                }                                  
                                            }  
                                        }
                                    }
                                }   
                                
                                //console.log(document.getElementById('search-integrations').checked);
                                if(document.getElementById('search-integrations').checked){                        
                                    if(search[i].integrations && search[i].integrations.length > 0){   
                                        for (let j = 0; j < search[i].integrations.length; j++) {
                                            if(search[i].integrations[j].name){
                                                if(search[i].integrations[j].name.includes(query)){
                                                    showMe = 1;
                                                }                                  
                                             }  
                                        }
                                    }
                                }                                  

                                if(showMe == 1){

                                    var tags = '';
                                    for (let j = 0; j < search[i].tags.length; j++) {
                                        tags += search[i].tags[j];
                                        if(j != search[i].tags.length){
                                            tags += ", ";
                                        }
                                    }           
                                    tags = tags.substring(0, tags.length - 2);                         

                                    rows += '<tr>';
                                    rows += '<td style="width: 50%; text-align:left; vertical-align: middle;"><strong>' + search[i].name + '</strong> <br>' + tags + '</td>';
                                    rows += '<td style="width: 50px;">';
                                    if(website_url != ''){
                                        rows += '<a href="' + website_url + '" target="_blank"><button type="button" class="btn btn-outline-primary">Website</button></a>';
                                    }
                                    rows += '</td>';                                    
                                    rows += '<td><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#' + slugify(search[i].name) + '-common" aria-expanded="false" aria-controls="collapseExample">URLs</button></td>';  
                                    rows += '<td><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#' + slugify(search[i].name) + '-logs" aria-expanded="false" aria-controls="collapseExample">LOGS</button></td>';                             
                                    rows += '<td><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#' + slugify(search[i].name) + '-notes" aria-expanded="false" aria-controls="collapseExample">NOTES</button></td>';   
                                    rows += '<td><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#' + slugify(search[i].name) + '-features" aria-expanded="false" aria-controls="collapseExample">FEAT</button></td>';   
                                    rows += '<td><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#' + slugify(search[i].name) + '-integrations" aria-expanded="false" aria-controls="collapseExample">INTEG</button></td>';                                       
                                    rows += '<td><a href="https://github.com/naftiko/organizations/blob/main/_data/' + search[i].aid + '/apis.yml" target="_blank"><button type="button" class="btn btn-outline-primary">APIs.json</button></a></td>';
                                    rows += '<td><a href="https://contracts.apievangelist.com/store/' + search[i].aid + '" target="_blank"><button type="button" class="btn btn-outline-primary">AE</button></a></td>';                                    
                                    rows += '</tr>';

                                    rows += '<tr class="collapse" id="' + slugify(search[i].name) + '-common">';
                                    rows += '<td colspan="4" style="text-align:left; padding: 5px 75px 5px 75px;">';    
                      
                                    if(search[i].common){
                                        
                                        rows += '<p><strong>Common Properties</strong></p>'; 
                                        rows += '<ul>';      
                                        for (let j = 0; j < search[i].common.length; j++) {
                                            rows += '<li><a href="' + search[i].common[j].url + '" target="_blank">' + search[i].common[j].type + '</a></li>'; 
                                        }
                                        rows += '</ul>';   
                                    }                                
                        
                                    rows += '</td>';
                                    rows += '</tr>';   

                                    rows += '<tr class="collapse" id="' + slugify(search[i].name) + '-logs">';
                                    rows += '<td colspan="4" style="text-align:left; padding: 5px 75px 5px 75px;">';    

                                    if( search[i].logs){
                                        rows += '<p><strong>Logs</strong></p>'; 
                                        rows += '<ul>';      
                                        for (let j = 0; j < search[i].logs.length; j++) {
                                            rows += '<li>' + search[i].logs[j].date + ' - ' + search[i].logs[j].message + '</li>'; 
                                        }
                                        rows += '</ul>';   
                                    }                                
                        
                                    rows += '</td>';
                                    rows += '</tr>';   
                                    
                                    rows += '<tr class="collapse" id="' + slugify(search[i].name) + '-notes">';
                                    rows += '<td colspan="9" style="text-align:left; padding: 5px 75px 5px 75px;">';    

                                    if( search[i].notes){
                                        rows += '<p><strong>Notes</strong></p>'; 
                                        rows += '<ul>';      
                                        for (let j = 0; j < search[i].notes.length; j++) {
                                            rows += '<li>' + search[i].notes[j].date + ' - ' + search[i].notes[j].message + '</li>'; 
                                        }
                                        rows += '</ul>';   
                                    }                                 
                        
                                    rows += '</td>';
                                    rows += '</tr>'; 
                                    
                                    rows += '<tr class="collapse" id="' + slugify(search[i].name) + '-features">';
                                    rows += '<td colspan="9" style="text-align:left; padding: 5px 75px 5px 75px;">';    

                                    if( search[i].features){
                                        rows += '<p><strong>Features</strong></p>'; 
                                        rows += '<ul>';      
                                        for (let j = 0; j < search[i].features.length; j++) {
                                            rows += '<li>' + search[i].features[j].name + '</li>'; 
                                        }
                                        rows += '</ul>';   
                                    }                                                                
                        
                                    rows += '</td>';
                                    rows += '</tr>'; 
                                    
                                    rows += '<tr class="collapse" id="' + slugify(search[i].name) + '-integrations">';
                                    rows += '<td colspan="9" style="text-align:left; padding: 5px 75px 5px 75px;">';    
                                    
                                    if( search[i].integrations){
                                        rows += '<p><strong>Integrations</strong></p>'; 
                                        rows += '<ul>';      
                                        for (let j = 0; j < search[i].integrations.length; j++) {
                                            rows += '<li>' + search[i].integrations[j].name + '</li>'; 
                                        }
                                        rows += '</ul>';   
                                    }                                    
                        
                                    rows += '</td>';
                                    rows += '</tr>';                                     

                                }

                            }
                        }
                        if(render==1){
                            document.getElementById('search-results').innerHTML = rows;
                        }
                    }
                    else{
                        if(render==1){
                            document.getElementById('search-results').innerHTML = '<tr><th scope="row"></th><td style="padding: 25px;">No Results</td></tr>';
                        }
                    }
                });
            })
            .catch(function(err) {
                console.log('Error: ' + err);
        });               
    }    