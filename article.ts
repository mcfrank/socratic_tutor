export const ARTICLE_CONTENT = `Rational analysis is an approach to understanding human cognition that treats it as optimized to solve problems given certain constraints. For example, a rational analysis of memory starts from the idea that memory systems are optimized to the statistics of how the items to be remembered occur in the environment. Constructing a rational analysis requires specifying the goals of the cognitive system and then developing a formal model that instantiates those goals within the organism’s environment. In contrast to many approaches to computational modeling in cognitive science, rational analysis makes limited assumptions about the nature of the organism’s computational processes or resources. The approach of modeling the mind as performing optimal statistical inferences for a particular environment is tightly linked to the broader tradition of Bayesian cognitive modeling. 

History

The term “rational analysis” was introduced by John R. Anderson (; ), but it had many intellectual predecessors. There was a long tradition of treating human behavior as adapted to the structure of the environment (e.g., ; ). Evolutionary analysis in general treats all aspects of organisms as shaped by their environmental history, and there had been successful treatments of an animal’s behavior as arising from optimization to the structure of its environment. For example, optimal foraging theory concerns the best way to search for resources under assumptions about their distribution in the environment (). There were already explicit evolutionary explanations of aspects of cognition prior to the introduction of rational analysis (e.g., ).

Anderson’s two most developed applications were for predicting (1) experimental results in memory from a model of how demands for particular stimuli appear in the environment () and (2) results in categorization experiments from a model of how features are associated with categories. There have since been rational analyses of many other cognitive domains, including the Wason selection task (), the approximate number system (), and curiosity behaviors (), to name a few. Many of these efforts have involved extensive Bayesian analyses and can be seen as part of a growing approach that uses Bayesian models of cognition () [see Bayesian Models of Cognition; Bayesianism].

Core concepts

Rational analysis is typically described as a program of research that involves the following six steps:

Precisely specify the goals of the cognitive system.

Develop a formal model of the environment to which the system is adapted.

Make the minimal assumptions about computational limitations.

Derive the optimal behavioral function given items one through three.

Examine the empirical literature to see if the predictions of the behavioral function are confirmed.

If the predictions are off, then iterate.

Predictions of behavior can be derived from statistical models of the environment (step two). For instance, major effects in human memory can be predicted from a plausible mathematical model of the environmental distribution of memory requests ().

Early rational analyses involved only minimal computational assumptions (step three) in an effort to focus on environmental models. For instance, the assumption in the memory model was simply that memories become available in a serial order. This focus on the environment rather than the nature of computations inside individual minds led to rational analysis being construed as in opposition to more conventional mechanistic approaches that focused on specific psychological processes. A mechanistic approach would describe the processes that determined how quickly a memory became available; in contrast, rational approaches focused on when they ought to be available based on the typical demands on agents in a specific environment.

The either/or opposition between rational analysis and mechanistic approaches has disappeared. For instance, the ACT-R (Adaptive Control of Cognition–Rational) architecture () is a process-based model of cognition, but it uses rational analysis to guide its mechanistic assumptions. For instance, the activation computations in ACT-R’s declarative memory—the computations that determine the strength of a memory—were based on the rational analysis of memory. Rational analysis-based activation computations have been adopted by other theories of cognition as well (e.g., ; ).

Questions, controversies, and new developments

Just-so stories? 

Most statistical models developed through rational analysis (including the  memory model) lack hard evidence that they actually describe the environments of humans. This feature leads to the criticism that such models are “just-so” stories in which the theorist makes up environments to fit the data (e.g., ; ). In the case of memory, however, there is some evidence that the statistics of the environment do match the proposed model (). For instance, in headlines in the New York Times, the appearance of a word in a headline can be assumed to be a demand on the reader to retrieve the reference of the word to decide whether to read the article. The statistics of these demands (one proxy for the kind of memory environment human organisms find themselves in) were similar to those assumed by the formal model and led to predictions that matched qualitative effects in human memory. These early databases were not large enough to provide quantitative predictions for memory experiments, however. More recent use of large databases (for example, Twitter messages and Reddit comments) have led to changes in the model as well as precise predictions for further memory experiments ().

More generally, rational analysis tends to consist of post hoc reconstructions of experimental results. It should be possible to predict novel results from the assumption of optimal behavior, however. One instance of such a novel prediction is the prediction of how contextual priming and recency should combine to predict the success of word completions ().

Resource-rational analysis

Rational analysis is often applied to what, in cognitive architectures, are single steps of cognition, such as retrieving a memory or assigning a category to an object. This feature limits the usefulness of this approach in understanding more complex cognition, where many steps are put together to produce an answer or appropriate behavior. Resource-rational analysis (see ) is an extension of rational analysis that assumes that these steps are put together in an optimal way given the constraints placed on these components. For instance, it is possible to predict fixation patterns in choice tasks from optimal information sampling (). This approach can be extended to explain individual differences in behavior. For instance, differences in how people play a fast-paced video game can be predicted by assuming that they make optimal choices given differences in the precision of their motor actions that had been measured in simple tasks ().

Broader connections

Rational analysis is tightly connected with the broader project of making Bayesian models of cognition because specific rational analyses often make use of the normative statistical inferences available through Bayesian computation. Philosophers and theorists distinguish different levels of explanation for cognitive phenomena; rational analysis is often assumed to be a route to high-level explanations at the level of computational theory () rather than mechanistic explanations [see Mechanistic Explanation]. Finally, rational analysis is related to evolutionary psychology, although it is typically distinguished by its emphasis on computational modeling.`;