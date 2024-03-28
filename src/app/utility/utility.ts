/**
 * name
 */
export class Utility {
    getImageUrl(overviewfiles: any): string| null{
        if(overviewfiles.length > 0){
            const imgObj = overviewfiles[0];
            if(imgObj && imgObj.fileurl){
                  return imgObj.fileurl.replace('/webservice','');  
            }
        }
       return null;
    }

    getToken(): any{
        const token = '418ad191d3346e9490d078712f066ed8'
        return token;
    }
}