import { AdvancedJobQuery } from "../services/jobService";

export type RootStackParamList = {
  JobDetail: {id: number}
  JobSubmit: {jobId: number, jobName: string}
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
  ForgotPassword: {isEmployee: boolean}
  ResetPassword: { email: string; isEmployee: boolean }

  Blog: undefined
  ArticleDetail: { id: number }

  //Notification
  Notification: undefined


  //Application
  EmployeeDetailApplication: {applicationId: number; status: string; coverLetter: string; jobTitle: string; cvUrl: string}
  EmployerDetailApplication: {applicationId: number}
  ApplicationsByJob: { jobId: number;}
};
// type JobDetailNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "JobDetail"
// >;