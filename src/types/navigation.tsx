
export type RootStackParamList = {
  JobDetail: undefined
  JobSubmit: undefined
  JobSubmitSuccess: undefined
  MainApp: undefined
  MainAppEmployer: undefined
  SearchFilter: undefined
  Chat: undefined

  //Settings
  Setting: undefined
  ChangePassword: undefined
  ChangeEmail: undefined

  //Employer
  PostJob : undefined
  EmployerSearchFilter: undefined

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