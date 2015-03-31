# nond.js server
using port 8080

# mongoDB
use interviewDB

# API
 -METHOD -URL

-GET  -hostURL/questions/list  
//get question list
    
    response example:
    [{"_id":"5510b357fc789da15cd2cf1f","description":"what is html5?","tags":["java","javascript"]}]
      
 -GET  -hostURL/questions?id=5510b357fc789da15cd2cf1f  
 //get data of one question by _id
    
    response example:
    {
       "_id": "5519fc0642e1fb471ec1df0d",
       "title": "what is html5？",
       "description": "d d d d",
       "tags": ["aaaa"],
      "answers": [
          {
              "_id": "5519fc1542e1fb471ec1df0e",
              "description": "hhahaha"
          },
          {
              "_id": "5519fc1942e1fb471ec1df0f",
              "description": "hhahaha"
          }
      ]
    }
      
-POST -hostURL/questions  
//create a new question
    
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
//remove a question by _id  
//also remove all related answers
    
    require example:
      {
          "action": "remove",
          "data": {
              "_id":"5510b357fc789da15cd2cf1f"
          }
      }
      
    response status 200/400 for success/faild.
    
 -POST -hostURL/answers  
 //create a new answer for qustion(by _id)
 
    require example:
       {
           "action": "create",
           "data": {
               "description": "testtest",
               "questionId": "5510b357fc789da15cd2cf1f"
           }
       }
      
    response status 200/400 for success/faild.
    
 -POST -hostURL/answers  
 //remove an answer by _id
 
    require example:
     {
         "action": "remove",
         "data": {
             "_id": "5511fc25456360f6698e7c51"
         }
     }
      
    response status 200/400 for success/faild.
    
 
