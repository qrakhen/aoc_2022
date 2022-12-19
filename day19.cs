using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace ConsoleApp10
{
    class Program
    {
        enum Resource
        {
            // lowercase because input
            none,
            ore,
            clay, 
            obsidian,
            geode
        }

        class Robot
        {
            public Resource resource;
            public Robot(Resource resource)
            {
                this.resource = resource;
            }
        }

        class Blueprint
        {
            public Resource resource;
            public Dictionary<Resource, int> cost = new Dictionary<Resource, int>();
            public Blueprint(Resource resource)
            {
                this.resource = resource;
            }
        }

        class BlueprintSet
        {
            public Dictionary<Resource, Blueprint> blueprints = new Dictionary<Resource, Blueprint>();
            public Dictionary<Resource, int> maxBots = new Dictionary<Resource, int>() {
                { Resource.ore, 0 },
                { Resource.clay, 0 },
                { Resource.obsidian, 0 },
                { Resource.geode, 999 }
            };
        }

        class Run
        {
            public List<Robot> robots = new List<Robot>();
            public BlueprintSet set;
            public Dictionary<Resource, int> resources = new Dictionary<Resource, int>() {
                { Resource.ore, 0 },
                { Resource.clay, 0 },
                { Resource.obsidian, 0 },
                { Resource.geode, 0 }
            };

            public Run(BlueprintSet set)
            {
                this.set = set;
            }

            public bool need(Resource resource)
            {
                return true;
                // some simple strategy
                return robots.Count(_ => (_.resource == resource)) < set.maxBots[resource];
            }
        }

        static Robot tryBuild(Blueprint blueprint, Dictionary<Resource, int> resources)
        {
            Robot robot = null;
            bool t = true;
            foreach (var c in blueprint.cost) {
                if (resources[c.Key] < c.Value) {
                    t = false;
                    break;
                }
            }
            if (t) {
                foreach (var c in blueprint.cost) {
                    resources[c.Key] -= c.Value;                    
                }
                robot = new Robot(blueprint.resource);
            }
            return robot;
        }

        // i'm gonna bruteforce this ****
        static int runSet(BlueprintSet set)
        {
            var run = new Run(set);
            run.robots.Add(new Robot(Resource.ore));
            Robot built;
            Console.WriteLine("maxBots");
            foreach (var s in set.maxBots) {
                Console.WriteLine(s.Key + ": " + s.Value);
            }
            for (int i = 0; i < 24; i++) {
                Console.WriteLine("minute " + (i+1));
                // could do this so much better i'm literally sick
                // strategy: always buy geode, but reverse order after that for base materials
                built = tryBuild(set.blueprints[Resource.geode], run.resources);
                if (built == null) {
                    var fake = run.resources.ToDictionary(entry => entry.Key,
                                               entry => entry.Value);
                    run.robots.ForEach(_ => {
                        fake[_.resource] += 1;
                    });
                    if (tryBuild(set.blueprints[Resource.geode], fake) != null) {
                        Console.WriteLine("COULD AFFORD GEODE NEXT ROUND");
                    }
                }
                if (built == null && run.need(Resource.obsidian)) built = tryBuild(set.blueprints[Resource.obsidian], run.resources);
                if (built == null && run.need(Resource.clay)) built = tryBuild(set.blueprints[Resource.clay], run.resources);
                if (built == null && run.need(Resource.ore)) built = tryBuild(set.blueprints[Resource.ore], run.resources);

                if (built != null)
                    Console.WriteLine("building a " + built.resource + " robot.");

                run.robots.ForEach(_ => {
                    run.resources[_.resource] += 1;
                });

                Console.WriteLine("after mining: ");
                foreach (var r in run.resources) {
                    Console.WriteLine(r.Key + ": " + r.Value);
                }

                if (built != null)
                    run.robots.Add(built);
                built = null;

                Console.WriteLine(" === \n");
            }
            Console.WriteLine("bots");
            foreach (var r in run.resources) {
                Console.WriteLine(r.Key + ": " + run.robots.Count(_ => _.resource == r.Key));
            }
            Console.WriteLine("res");
            foreach (var r in run.resources) {
                Console.WriteLine(r.Key + ": " + r.Value);
            }
            return run.resources[Resource.geode];
        }

        static List<BlueprintSet> generateSets(string input)
        {
            var list = new List<BlueprintSet>();
            input.Split("\n").ToList().ForEach(_ => {
                var set = new BlueprintSet();
                _.Split(".").ToList().ForEach(__ => {
                    if (__.Length < 2) return;
                    // my regex game got really weak
                    var r = __.Contains("and") ? new Regex(@"Each (.+?) .+(\d+? .+?) and (\d+? .+)$") : new Regex(@"Each (.+?) .+(\d+? .+)$");
                    var m = r.Match(__);
                    var res = (Resource)Enum.Parse(typeof(Resource), m.Groups[1].Value);
                    var c1 = m.Groups[2].Value;
                    var c2 = m.Groups.Count > 3 ? m.Groups[3].Value : "";
                    var cr1 = (Resource)Enum.Parse(typeof(Resource), c1.Split(' ')[1]);
                    var cc1 = int.Parse(c1.Split(' ')[0]);
                    var cr2 = c2 != "" ? (Resource)Enum.Parse(typeof(Resource), c2.Split(' ')[1]) : Resource.none;
                    var cc2 = c2 != "" ? int.Parse(c2.Split(' ')[0]) : 0;
                    var bp = new Blueprint(res);
                    bp.cost.Add(cr1, cc1);
                    if (cc2 > 0)
                        bp.cost.Add(cr2, cc2);
                    set.blueprints.Add(res, bp);

                    //if (res == Resource.geode || res == Resource.obsidian) {
                        foreach (var c in bp.cost) {
                            if (set.maxBots[c.Key] < c.Value) {
                                set.maxBots[c.Key] = c.Value;
                            }
                        }
                    //}
                    
                });
                list.Add(set);
            });
            return list;
        }

        static void Main(string[] args)
        {
            var sets = generateSets(input);
            Console.Write(sets.Count);
            var results = new Dictionary<int, int>();
            int max = 0;
            int qSum = 0;
            for (int i = 0; i < sets.Count; i++) {
                Console.WriteLine("set " + (i + 1) + ": ");
                var g = runSet(sets[i]);
                var q = g * (i + 1);
                qSum += q;
                results.Add(i, g);                
                if (g > max)
                    max = g;
                Console.WriteLine("quality: " + q);
                Console.WriteLine(" --- \n\n");
            }
            Console.WriteLine(max);
            Console.WriteLine(qSum);
        }

        const string input = @"Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 20 clay. Each geode robot costs 2 ore and 12 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 3: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 4 ore and 7 obsidian.
Blueprint 4: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 6 clay. Each geode robot costs 2 ore and 20 obsidian.
Blueprint 5: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 2 ore and 18 obsidian.
Blueprint 6: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 4 ore and 15 obsidian.
Blueprint 7: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 15 clay. Each geode robot costs 3 ore and 20 obsidian.
Blueprint 8: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 9: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 10: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 5 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 11: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 11 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 12: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 20 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 13: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 7 clay. Each geode robot costs 4 ore and 17 obsidian.
Blueprint 14: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 20 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 15: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 3 ore and 11 obsidian.
Blueprint 16: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 14 clay. Each geode robot costs 4 ore and 11 obsidian.
Blueprint 17: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 15 clay. Each geode robot costs 4 ore and 9 obsidian.
Blueprint 18: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 3 ore and 17 obsidian.
Blueprint 19: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 2 ore and 9 obsidian.
Blueprint 20: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 11 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 21: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 10 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 22: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 23: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 15 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 24: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 8 clay. Each geode robot costs 3 ore and 19 obsidian.
Blueprint 25: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 9 clay. Each geode robot costs 3 ore and 9 obsidian.
Blueprint 26: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 2 ore and 20 obsidian.
Blueprint 27: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 10 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 28: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 4 ore and 8 obsidian.
Blueprint 29: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 9 clay. Each geode robot costs 3 ore and 19 obsidian.
Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 13 clay. Each geode robot costs 2 ore and 10 obsidian.";
    }
}
