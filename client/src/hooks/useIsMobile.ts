import { useEffect, useState } from "react";
import { Resolutions } from "../values/resolutions";

export default function useIsMobile(size = Resolutions.MOBILE_VERTICAL_LARGE) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < size);
    };
    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [size]);

  return isMobile;
}
