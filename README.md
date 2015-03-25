# nond.js server
using port 8080

# mongoDB
use interviewDB

# API
 -METHOD -URL

-GET  -hostURL/questions/list
    
    response example:
    [{"_id":"5510b357fc789da15cd2cf1f","description":"what is html5?","tags":["java","javascript"]}]
      
-POST -hostURL/questions
    
    require example:
      {
          "action": "create",
          "data": {
              "description": "what is html5?",
              "tags": [
                  "java",
                  "javascript"
              ]
          }
      }
      
    response status 200/400 for success/faild.
    
-POST -hostURL/questions
    
    require example:
      {
          "action": "remove",
          "data": {
              "_id":"5510b357fc789da15cd2cf1f"
          }
      }
      
    response status 200/400 for success/faild.
    
 -POST -hostURL/answers
 
    require example:
       {
           "action": "create",
           "data": {
               "questionId": "5510b357fc789da15cd2cf1f"
           }
       }
      
    response status 200/400 for success/faild.
    
 -POST -hostURL/answers
 
    require example:
     {
         "action": "remove",
         "data": {
             "_id": "5511fc25456360f6698e7c51"
         }
     }
      
    response status 200/400 for success/faild.
    
 
