"use client";
import {useEffect,useState,useCallback} from 'react';
import {clientApi,errorText} from '@/lib/client';
export function useResource<T>(path:string){
 const [data,setData]=useState<T|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 const reload=useCallback(async()=>{setLoading(true);setError('');try{setData(await clientApi<T>(path));}catch(e){setError(errorText(e));}finally{setLoading(false);}},[path]);
 useEffect(()=>{void reload();},[reload]);
 return {data,loading,error,reload};
}
