import { AdvancedJobQuery } from "../services/jobService";

export type RootStackParamList = {
  JobDetail: {id: number}
  JobSubmit: undefined
  JobSubmitSuccess: undefined
  MainApp: undefined
  MainAppEmployer: undefined
  SearchMain: { initialTab: string } | undefined | { advanceFilter: AdvancedJobQuery }
  SearchFilter: {
    currentFilter?: any;
    onApply?: (filter: any) => void;
  };
  Chat: undefined
  CompanyDetail: {id: number}
  //Settings
  Setting: undefined
  ChangePassword: undefined
  ChangeEmail: undefined

  //Employer
  PostJob: undefined
  UpdateJob: { id: number }
  EmployerSearchFilter: undefined
  UpdateCompanyInfo: { id: number }
  UpdateCompanyMedia: undefined

  //Auth
  ConfirmEmail: {email: string, role: string}
  Login: undefined
  Register: undefined
  EmployerLogin: undefined
  EmployerRegister: undefined


  Blog: undefined
  ArticleDetail: { id: number }
};
// type JobDetailNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "JobDetail"
// >;