import React from 'react'
const AppContext = React.createContext()

export default AppContext

export function useAppContext() {
    const context = React.useContext(AppContext);
    if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
  }

  export function useIsAuthenticated() {

    const context = useAppContext();
    // console.log("isauthenticated", context);
    return context.isAuthenticated;
  }


export function useAuthUser() {

    const context = useAppContext();
    // console.log("isauthenticated", context);
    return context.user;
  }

  export function useInstituteId() {

    const context = useAppContext();
    // console.log("isauthenticated", context);
    return context.user?.staff?.institute?._id;
  }