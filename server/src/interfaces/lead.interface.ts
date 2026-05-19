export interface ILead {
  name: string;

  email: string;

  status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Lost";

  source:
    | "Website"
    | "Instagram"
    | "Referral";
}