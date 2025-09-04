import { motion } from "framer-motion";
import { sectionTitleVariants, cardStaggerVariants, cardItemVariants } from "../../hooks/useAnimationVariants";


export default function PopularRoutes() {
  return (
 
        <section className="py-16 px-6 md:px-12 ">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionTitleVariants}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{fontSize:"2.7rem"}}>Popular Routes</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after journeys, carefully curated to showcase the best destinations. Explore top-rated routes and start your adventure today.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardStaggerVariants}
          >
           
            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex cursor-pointer flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://images.unsplash.com/photo-1644810495465-04a89151ee07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eWFuZ29ufGVufDB8fDB8fHww" className="w-full  object-cover" alt="Yangon"/>
                  <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "
> Yangon to Mandalay</p>
              </div>
            </motion.div>
               <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                 <img src="https://media-cdn.tripadvisor.com/media/photo-s/16/36/a6/68/mandalay-palace-wall.jpg" className="w-full  object-cover" alt="Mandalay"/>
                 <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "
>  Mandalay to Yangon</p>
              </div>
            </motion.div>
               <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Sagaing3.jpg" className="w-full  object-cover" alt="Sagaing"/>
                 <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "
> Sagaing to Yangon</p>
              </div>
            </motion.div>

             <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://ik.imgkit.net/3vlqs5axxjf/external/http://images.ntmllc.com/v4/destination/Myanmar/Nay-Pyi-Taw/5238041_SCN_Nay-Pyi-Taw_iStock-178746675_Z822C1.jpg?tr=w-1200%2Cfo-auto" className="w-full  object-cover h-48" alt="Inn Lay"/>
                  <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "> Mandalay to Naypyidaw</p>
              </div>
            </motion.div>
            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://www.sampantravel.com/wp-content/uploads/2020/02/Kalaw-Train-Station-Myanmar.-Kalaw-Image.-Small-Files.-4-May-22-e1659434097442-1600x600.jpg" className="w-full  object-cover h-48" alt="Bagan"/>
                <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "> Mandalay to Kalaw</p>
                  </div>
             </motion.div>
             
               <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://d6qyz3em3b312.cloudfront.net/upload/images/media/2019/05/29/shutterstock_500746483.2048x1024.jpg" className="w-full  object-cover h-48" alt="Bagan"/>
                <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "> Mandalay to TaungGyi</p>
                  </div>
             </motion.div>
              <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://media.istockphoto.com/id/536514344/photo/vibrant-color-of-inle-lake.jpg?s=612x612&w=0&k=20&c=Oq87pGDYpsTYExQPQd8sf-FeqGkCYgB-i4bOuA3Nnp4=" className="w-full  object-cover h-48" alt="Bagan"/>
                <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "> Mandalay to InnLay</p>
                  </div>
             </motion.div>
              

            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <img src="https://cff2.earth.com/uploads/2021/08/18190300/Mawlamyine-Myanmar_1medium-960x640.jpg" className="w-full  object-cover h-48" alt="Bagan"/>
                <p className="absolute p-2 text-white px-3 backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none  bg-black/35  rounded-3xl m-2  "> Mandalay to Mawlamyine</p>
                  </div>
             </motion.div>

              </motion.div>
        </section>
  )
}
