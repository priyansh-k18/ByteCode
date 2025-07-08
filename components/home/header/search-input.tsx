import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { searchAction } from '@/actions/search'

const SearchInput = () => {
  const Searchparams = useSearchParams();
  
  return (
    <form action={searchAction}>
       <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'/>
        <Input type='search'
         name='search'
         defaultValue={Searchparams.get("search") || ""}
         placeholder='search articles...'
        className='pl-10 w-48 focus-visible:ring-1'
        />
       </div>
    </form>
  )
}

export default SearchInput;

