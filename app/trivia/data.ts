import { GiPerspectiveDiceSixFacesRandom, GiBookCover, GiFilmProjector, GiMusicalNotes, GiTv, GiMaterialsScience, GiEarthAmerica } from "react-icons/gi";
import { CgGames } from "react-icons/cg";
import { BiMath } from "react-icons/bi";
import { MdOutlineSportsBasketball, MdHistoryEdu  } from "react-icons/md";
import { RiGovernmentFill  } from "react-icons/ri";
import { TbUserStar } from "react-icons/tb";
import { FaDog, FaCar } from "react-icons/fa";
import { Category } from "./types";

export const categories: Category[] = [
    { id: 9, name: 'General', img: GiPerspectiveDiceSixFacesRandom }, 
    { id: 10, name: 'Books', img: GiBookCover },
    { id: 11, name: 'Film', img: GiFilmProjector }, 
    { id: 12, name: 'Music', img: GiMusicalNotes },
    { id: 14 ,name: 'Television', img: GiTv  }, 
    { id: 15, name: 'Games', img: CgGames },
    { id: 17, name: 'Science', img: GiMaterialsScience },
    { id: 19, name: 'Math', img: BiMath },
    { id: 21, name: 'Sports', img: MdOutlineSportsBasketball }, 
    { id: 22, name: 'Geography', img: GiEarthAmerica },
    { id: 23, name: 'History', img: MdHistoryEdu }, 
    { id: 24, name: 'Politics', img: RiGovernmentFill }, 
    { id: 26, name: 'Celebrities', img: TbUserStar }, 
    { id: 27, name: 'Animals', img: FaDog },
    { id: 28, name: 'Vehicles', img: FaCar }
]