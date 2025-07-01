import AllArticlePage from '@/components/articles/all-article-page'
import ArticleSearchInput from '@/components/articles/article-search-input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen bg-background'>
        <main className='container mx-auto px-4 py-12 sm:px-6 lg:text-5xl'>
            {/* Page header */}
            <div className='mb-12 space-y-6 text-center'>
                <h1 className='text-4xl font-bold sm:text-5xl'>All Articles</h1>
                
                {/* Search Bar */}
                <ArticleSearchInput/>

                <div>
                  {/* All Article card */} 

                  <AllArticlePage/>
                  {/* pagination*/} 

                  <div>
                    <Button variant={'ghost'}>
                        <ArrowLeft/>
                        Prev
                    </Button>
                    <Button variant={'ghost'} size={'sm'}>
                        1
                    </Button>
                    <Button variant={'ghost'} size={'sm'}>
                        2
                    </Button>
                    <Button variant={'ghost'} size={'sm'}>
                        3
                    </Button>
                    <Button variant={'ghost'}>
                        <ArrowRight/>
                        Next
                        
                    </Button>
                  </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default page