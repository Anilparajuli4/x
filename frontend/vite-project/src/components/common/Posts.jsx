

import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../skeletons/PostSkeleton";

import Post from "./Post";
import { useEffect } from "react";

const Posts = ({feedType}) => {
	

	const getPostEndPoint = () => {
		switch(feedType){
			case 'forYou':
			return "/api/posts/all"
				case 'following':
			return "/api/posts/following";
			default:
				return "/api/posts/all"
		}
	}

	const post_ENDPOINT = getPostEndPoint()

	const {data:postdata, refetch, isRefetching, isLoading} = useQuery({
		queryKey:["posts"],
		queryFn: async () =>{
			try {
				const res = await fetch(post_ENDPOINT)
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.error || 'something went wrong'	)
				}
				return data
			} catch (error) {
				console.log(error);
			}
		}

	})
	
useEffect(()=>{
  refetch()
},[feedType, refetch])
	return (
		<>
			{(isRefetching || isLoading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && postdata?.data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching &&  postdata?.data && (
				<div>
					{postdata?.data?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;