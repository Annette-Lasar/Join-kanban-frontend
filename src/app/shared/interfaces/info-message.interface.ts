export interface InfoMessage {
    securityQuestion?: boolean;
    textAndIcon?: boolean;
    alertTitle?: string;
    infoQuestion?: string;
    infoText?: string;
    infoMessageClass?: string; // notwendig?
    imageSrc?: string;
    imageSrc2?: string;
    actionType?: string;
    nextActionType?: string;
    caption?: string;
    caption1?: string;
    caption2?: string;
    id?: number;
    isVisible?: boolean; 
    persistent?: boolean;
  }
  