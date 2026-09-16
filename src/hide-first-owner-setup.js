const removeFirstOwnerSetup=()=>document.getElementById('setup')?.remove();
new MutationObserver(removeFirstOwnerSetup).observe(document.body,{childList:true,subtree:true});
removeFirstOwnerSetup();
