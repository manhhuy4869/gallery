import { Cloudinary } from "@cloudinary/url-gen";
import ImageGallery from "./Source/ImageGallery";
import Dialog from "./Source/Dialog";
import { useState } from "react";
const lIF = [
  {
      "iF": "Baku Ane",
      "tI": 619
  },
  {
      "iF": "Chijoku no Seifuku",
      "tI": 2013
  },
  {
      "iF": "Chijoku no Seifuku 2",
      "tI": 2098
  },
  {
      "iF": "Gakuen 3",
      "tI": 2785
  },
  {
      "iF": "Ingoku no Houkago",
      "tI": 2203
  },
  {
      "iF": "Kutsujoku",
      "tI": 1980
  },
  {
      "iF": "Kutsujoku 2",
      "tI": 2074
  },
  {
      "iF": "Kutsujoku 3",
      "tI": 2184
  },
  {
      "iF": "Kyoiku Shido",
      "tI": 3005
  },
  {
      "iF": "Kyonyuu Daikazoku Saimin",
      "tI": 3563
  },
  {
      "iF": "Kyonyuu Elf Oyako Saimin",
      "tI": 2770
  },
  {
      "iF": "Kyonyuu Hitozuma Onna Kyoushi",
      "tI": 3123
  },
  {
      "iF": "Kyonyuu Kazoku Saimin",
      "tI": 3754
  },
  {
      "iF": "Kyonyuu Princess Saimin",
      "tI": 2413
  },
  {
      "iF": "Kyousei Shihai",
      "tI": 2288
  },
  {
      "iF": "Lovely\u00d7Cation",
      "tI": 1327
  },
  {
      "iF": "Lovely\u00d7Cation 2",
      "tI": 1355
  },
  {
      "iF": "Love\u00d7Holic",
      "tI": 635
  },
  {
      "iF": "Mama Daikou",
      "tI": 615
  },
  {
      "iF": "Mama\u00d7Holic",
      "tI": 571
  },
  {
      "iF": "Mesu Kyoushi 3",
      "tI": 1876
  },
  {
      "iF": "Mesu Kyoushi 4",
      "tI": 2284
  },
  {
      "iF": "Pure\u00d7Holic",
      "tI": 659
  },
  {
      "iF": "Sansha Mendan",
      "tI": 2863
  },
  {
      "iF": "Shihai no Kyoudan",
      "tI": 1864
  },
  {
      "iF": "Shihai no Kyoudan 2",
      "tI": 2275
  },
  {
      "iF": "Shimai no Kyousei",
      "tI": 2419
  },
  {
      "iF": "Shinshoku",
      "tI": 2358
  },
  {
      "iF": "Youkoso! Sukebe Elf no Mori e",
      "tI": 2373
  }
];
const App = () => {
    const cld = new Cloudinary({ cloud: { cloudName: "dvmh6cg7v" } });
    const [folder, setfolder] = useState(lIF[0]);

    const handleFolderChange = (newFolder) => {
        setfolder(newFolder); // Cập nhật giá trị khi ComponentA thay đổi
    };
    return (
        <div>
            <section id='gallery'>
                <div className='container-fluid'>
                    <div id='image-gallery'>
                        {/* <div className='row'>
                            {images.map((img) => (
                                <div key={img.publicID} className='col-lg-2 image'>
                                    <div className='img-wrapper'>
                                        <a href={img}>
                                            <AdvancedImage key={img.publicID} cldImg={img} />
                                        </a>
                                        <div className='img-overlay'>
                                            <i className='fa fa-plus-circle text-white' aria-hidden='true'></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                        <ImageGallery cld={cld} folder={folder}/>
                    </div>
                </div>
            </section>
            <Dialog cld={cld} onFolderChange={handleFolderChange}/>
        </div>
    );
};

export default App;
