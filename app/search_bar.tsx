'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
  const searchParams = useSearchParams()
 
  const show = searchParams.get('show')
 
  // This will not be logged on the server when using static rendering
  console.log(show)
 
  return <>Search: {show}</>
}