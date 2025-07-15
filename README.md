# backend part
- [ ] initializing project and creating schema
- [ ] defining all route using mvc model user/admin,course,purchasedCourse
- [ ] writing instances of allroute endpoint  
- [ ] we'll use express,mongoose,zod,bcrypt,jwt,cors  
- [ ] work with .env  

- [ ] userRoute.get(api/v1/courses) //get all course detail

- [ ] userRoute.post(api/v1/user/signup) //for user signup body{userName,email,password,role=user or admin}   
- [ ] userRoute.post(api/v1/user/sigin) //for user signup  body{email,password}

- [ ] courseRoute.post(api/v1/course/create) //sigin in required as admin body{title,description,price,imageUrl} 
- [ ] courseRoute.put(api/v1/course/update) //sigin in required as admin body{title,description,price,imageUrl} 
- [ ] courseRoute.get(api/v1/course/created_course) //signin in required as admin 

- [ ] userPurchaseRoute.post(api/v1/purchase/course:courseId) //signin in required as user params=courseId 
- [ ] userPurchaseRoute.get(api/v1/purchased/course) //sigin in required as user  


