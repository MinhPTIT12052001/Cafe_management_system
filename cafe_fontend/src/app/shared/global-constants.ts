export class GlobalConstants{
    static contactRegex(contactRegex: any): (control: import("@angular/forms").AbstractControl<any, any>) => import("@angular/forms").ValidationErrors | null {
      throw new Error('Method not implemented.');
    }

    // Message
    public static genericError: string = 'Something went wrong. Please try again later';

    public static unauthorized: string = 'you are not authorized person access this page.';

    public static productAdded: string = "Product added successfully";

    public static productExistError: string = "Product already exists";

    // Regex
    public static nameRegex: string = '[a-zA-Z0-9]' ;

    public static emailRegex: string = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
    
    public static contactNumberRegex: string = '^[e0-9]{10,10}$';

    // Variable
    public static error: string = 'error';
}