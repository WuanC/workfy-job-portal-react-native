
export type RootStackParamList = {
  JobDetail: undefined
  JobSubmit: undefined
  JobSubmitSuccess: undefined
  MainApp: undefined
  MainAppEmployer: undefined
  SearchMain: {initialTab: string} | undefined
  SearchFilter: undefined
  Chat: undefined

  //Settings
  Setting: undefined
  ChangePassword: undefined
  ChangeEmail: undefined

  //Employer
  PostJob : undefined
  UpdateJob: {id: number}
  EmployerSearchFilter: undefined
  UpdateCompanyInfo: { id: number }
  UpdateCompanyMedia: undefined

  //Auth
  ConfirmEmail: undefined
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