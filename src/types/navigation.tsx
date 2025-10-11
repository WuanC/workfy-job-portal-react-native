
export type RootStackParamList = {
  JobDetail: undefined
  JobSubmit: undefined
  JobSubmitSuccess: undefined
  Login: undefined
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

  Blog: undefined
  ArticleDetail: { id: number }
};
// type JobDetailNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "JobDetail"
// >;