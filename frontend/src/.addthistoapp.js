{/* Admin Dashboard */}
<Route exact path="user4/managedocs" element={<ManageDocs server_addr={server_addr}/>} render={()=>console.log('checking...')} />
<Route path="user4/managedocsd" element={<ManageDocsD server_addr={server_addr}/>} />
<Route path="user4/manageops" element={<ManageOps server_addr={server_addr}/>} />
<Route path="user4/manageopsd" element={<ManageOpsD server_addr={server_addr}/>} />

<Route path="user4/treatment" element={<ManageDocs server_addr={server_addr}/>} />
<Route path="user4/test" element={<ManageDocsD server_addr={server_addr}/>} />
<Route path="user4/medication" element={<ManageOps server_addr={server_addr}/>} />
<Route path="user4/department" element={<ManageOpsD server_addr={server_addr}/>} />